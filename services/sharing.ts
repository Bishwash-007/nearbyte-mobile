import { Directory, File, Paths } from 'expo-file-system';

// Shared types
export interface TransferFile {
  id: string;
  uri: string;
  name: string;
  size: number;
  mimeType: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
}

export interface TransferCallbacks {
  onProgress: (id: string, transferred: number, total: number) => void;
  onComplete: (id: string, savedUri: string) => void;
  onError: (id: string, err: Error) => void;
}

// Wire protocol
// [4-byte big-endian header JSON length][header JSON bytes][raw file bytes]
interface FileHeader {
  id: string;
  name: string;
  size: number;
  mimeType: string;
}

// Sender
export async function sendFiles(
  socket: any,
  files: TransferFile[],
  callbacks: TransferCallbacks,
): Promise<void> {
  for (const f of files) {
    try {
      const header: FileHeader = {
        id: f.id,
        name: f.name,
        size: f.size,
        mimeType: f.mimeType,
      };
      const headerBytes = new TextEncoder().encode(JSON.stringify(header));
      const lenBuf = Buffer.alloc(4);
      lenBuf.writeUInt32BE(headerBytes.length, 0);

      socket.write(lenBuf);
      socket.write(Buffer.from(headerBytes));

      // Stream file in chunks so progress stays accurate for large files
      const source = new File(f.uri);
      const reader = source.readableStream().getReader();
      let sent = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        socket.write(Buffer.from(value));
        sent += value.length;
        callbacks.onProgress(f.id, sent, f.size);
      }

      callbacks.onComplete(f.id, f.uri);
    } catch (err) {
      callbacks.onError(f.id, err as Error);
    }
  }
}

// Receiver
// Stateful stream parser — call feed() each time the TCP socket emits data.

type ReceiverState = 'HEADER_LEN' | 'HEADER' | 'DATA';

const RECEIVE_DIR = new Directory(Paths.document, 'nearbyte-received');

export class FileReceiver {
  private buf = Buffer.alloc(0);
  private state: ReceiverState = 'HEADER_LEN';
  private headerLen = 0;
  private meta: FileHeader | null = null;
  private dataBuf = Buffer.alloc(0);
  private callbacks: TransferCallbacks;

  constructor(callbacks: TransferCallbacks) {
    this.callbacks = callbacks;
    if (!RECEIVE_DIR.exists) {
      RECEIVE_DIR.create({ idempotent: true });
    }
  }

  feed(chunk: Buffer | string): void {
    const data =
      typeof chunk === 'string' ? Buffer.from(chunk, 'binary') : chunk;
    this.buf = Buffer.concat([this.buf, data]);
    this.process();
  }

  private process(): void {
    for (;;) {
      if (this.state === 'HEADER_LEN') {
        if (this.buf.length < 4) break;
        this.headerLen = this.buf.readUInt32BE(0);
        this.buf = this.buf.subarray(4);
        this.state = 'HEADER';
      } else if (this.state === 'HEADER') {
        if (this.buf.length < this.headerLen) break;
        const headerBytes = this.buf.subarray(0, this.headerLen);
        this.meta = JSON.parse(
          new TextDecoder().decode(headerBytes),
        ) as FileHeader;
        this.buf = this.buf.subarray(this.headerLen);
        this.dataBuf = Buffer.alloc(0);
        this.state = 'DATA';
      } else if (this.state === 'DATA') {
        if (!this.meta) break;
        const { id, size } = this.meta;
        const take = Math.min(this.buf.length, size - this.dataBuf.length);
        if (take === 0) break;

        this.dataBuf = Buffer.concat([
          this.dataBuf,
          this.buf.subarray(0, take),
        ]);
        this.buf = this.buf.subarray(take);
        this.callbacks.onProgress(id, this.dataBuf.length, size);

        if (this.dataBuf.length >= size) {
          this.saveFile();
          this.meta = null;
          this.dataBuf = Buffer.alloc(0);
          this.state = 'HEADER_LEN';
        } else {
          break;
        }
      }
    }
  }

  private saveFile(): void {
    if (!this.meta) return;
    const { id, name } = this.meta;
    try {
      const dest = new File(RECEIVE_DIR, name);
      dest.write(new Uint8Array(this.dataBuf));
      this.callbacks.onComplete(id, dest.uri);
    } catch (err) {
      this.callbacks.onError(id, err as Error);
    }
  }
}
