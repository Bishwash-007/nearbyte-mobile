import type { DocumentPickerAsset } from 'expo-document-picker';
import type { ImagePickerAsset } from 'expo-image-picker';
import { create } from 'zustand';

import type { TransferCallbacks, TransferFile } from '@/services/sharing';
import { FileReceiver, sendFiles } from '@/services/sharing';

export type { TransferFile };

export interface TransferState {
  file: TransferFile;
  progress: number; // 0–100
  status: 'pending' | 'sending' | 'receiving' | 'completed' | 'error';
  savedUri?: string;
}

function mimeToType(mimeType: string): TransferFile['type'] {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('word') ||
    mimeType.includes('document') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation') ||
    mimeType === 'text/plain'
  )
    return 'document';
  return 'other';
}

function makeId(name: string): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`;
}

interface TransferStoreState {
  pendingFiles: TransferFile[];
  transfers: Record<string, TransferState>;
}

interface TransferStoreActions {
  // Picker normalization
  addFromImagePicker: (assets: ImagePickerAsset[]) => void;
  addFromDocumentPicker: (assets: DocumentPickerAsset[]) => void;
  removeFile: (id: string) => void;
  clearPending: () => void;

  // Sending
  sendAll: (socket: any) => Promise<void>;

  // Receiving
  // Returns a FileReceiver wired to this store — pass its .feed() to onServerData
  createReceiver: () => FileReceiver;

  // Internal state updaters (also callable from outside)
  updateProgress: (id: string, transferred: number, total: number) => void;
  markCompleted: (id: string, savedUri?: string) => void;
  markError: (id: string) => void;
  clearCompleted: () => void;
}

type TransferStore = TransferStoreState & TransferStoreActions;

const useTransferStore = create<TransferStore>((set, get) => ({
  pendingFiles: [],
  transfers: {},

  addFromImagePicker: (assets) =>
    set((state) => ({
      pendingFiles: [
        ...state.pendingFiles,
        ...assets.map(
          (file): TransferFile => ({
            id: makeId(file.fileName ?? file.uri),
            uri: file.uri,
            name: file.fileName ?? file.uri.split('/').pop() ?? 'unknown',
            size: file.fileSize ?? 0,
            mimeType: file.mimeType ?? 'application/octet-stream',
            type: mimeToType(file.mimeType ?? ''),
          }),
        ),
      ],
    })),

  addFromDocumentPicker: (assets) =>
    set((state) => ({
      pendingFiles: [
        ...state.pendingFiles,
        ...assets.map(
          (file): TransferFile => ({
            id: makeId(file.name),
            uri: file.uri,
            name: file.name,
            size: file.size ?? 0,
            mimeType: file.mimeType ?? 'application/octet-stream',
            type: mimeToType(file.mimeType ?? ''),
          }),
        ),
      ],
    })),

  removeFile: (id) =>
    set((state) => ({
      pendingFiles: state.pendingFiles.filter((file) => file.id !== id),
    })),

  clearPending: () => set({ pendingFiles: [] }),

  sendAll: async (socket) => {
    const { pendingFiles } = get();
    if (!pendingFiles.length) return;

    // Snapshot pending into transfers as 'pending'
    set((state) => ({
      transfers: {
        ...state.transfers,
        ...Object.fromEntries(
          pendingFiles.map((file) => [
            file.id,
            { file: file, progress: 0, status: 'pending' as const },
          ]),
        ),
      },
      pendingFiles: [],
    }));

    const callbacks: TransferCallbacks = {
      onProgress: (id, transferred, total) =>
        get().updateProgress(id, transferred, total),
      onComplete: (id, savedUri) => get().markCompleted(id, savedUri),
      onError: (id, err) => {
        console.error(`[transfer] error for ${id}:`, err);
        get().markError(id);
      },
    };

    await sendFiles(socket, pendingFiles, callbacks);
  },

  createReceiver: () =>
    new FileReceiver({
      onProgress: (id, transferred, total) =>
        get().updateProgress(id, transferred, total),
      onComplete: (id, savedUri) => get().markCompleted(id, savedUri),
      onError: (id, err) => {
        console.error(`[receive] error for ${id}:`, err);
        get().markError(id);
      },
    }),

  updateProgress: (id, transferred, total) =>
    set((state) => {
      const transfer = state.transfers[id];
      if (!transfer) return state;
      return {
        transfers: {
          ...state.transfers,
          [id]: {
            ...transfer,
            progress: total > 0 ? Math.round((transferred / total) * 100) : 0,
            status:
              transfer.status === 'pending'
                ? 'sending'
                : transfer.status === 'completed' || transfer.status === 'error'
                  ? transfer.status
                  : transfer.status,
          },
        },
      };
    }),

  markCompleted: (id, savedUri) =>
    set((state) => {
      const transfer = state.transfers[id];
      if (!transfer) return state;
      return {
        transfers: {
          ...state.transfers,
          [id]: { ...transfer, progress: 100, status: 'completed', savedUri },
        },
      };
    }),

  markError: (id) =>
    set((state) => {
      const transfer = state.transfers[id];
      if (!transfer) return state;
      return {
        transfers: {
          ...state.transfers,
          [id]: { ...transfer, status: 'error' },
        },
      };
    }),

  clearCompleted: () =>
    set((state) => ({
      transfers: Object.fromEntries(
        Object.entries(state.transfers).filter(
          ([, transfer]) => transfer.status !== 'completed',
        ),
      ),
    })),
}));

export default useTransferStore;
