import { create } from 'zustand';

import { DiscoveredDevice, NearbySession } from '@/services';

// session initialization is a bit heavy, so we create it once and reuse across the app
const session = new NearbySession();

interface SessionState {
  myIp: string;
  myDeviceName: string;
  devices: DiscoveredDevice[];
  connectedDevice: DiscoveredDevice | null;
  activeSocket: any | null;
  isScanning: boolean;
}

interface SessionActions {
  setup: (userName: string, avatar: string) => Promise<void>;
  teardown: () => void;
  connectToDevice: (device: DiscoveredDevice) => void;
  disconnect: () => void;
}

type SessionStore = SessionState & SessionActions;

const useSessionStore = create<SessionStore>((set, get) => ({
  myIp: '',
  myDeviceName: '',
  devices: [],
  connectedDevice: null,
  activeSocket: null,
  isScanning: false,

  setup: async (userName, avatar) => {
    const { ip, deviceName } = await session.setup({
      userName,
      avatar,
      onDeviceFound: (device) =>
        set((state) => {
          const exists = state.devices.some(
            (device) => device.deviceName === device.deviceName,
          );
          return {
            devices: exists
              ? state.devices.map((device) =>
                  device.deviceName === device.deviceName ? device : device,
                )
              : [...state.devices, device],
          };
        }),
      onDeviceRemoved: (name) =>
        set((state) => ({
          devices: state.devices.filter((device) => device.deviceName !== name),
        })),
      onServerConnection: (socket) => {
        // Incoming connection — treat as the active socket for the other side
        console.log(`Incoming connection from: ${socket.remoteAddress}`);
        set({ activeSocket: socket });
      },
      onServerData: (_socket, data) =>
        console.log(`Data received: ${data.length} bytes`),
      onError: (err) => console.log(`Session error: ${err?.message ?? err}`),
    });
    set({ myIp: ip, myDeviceName: deviceName, isScanning: true });
  },

  teardown: () => {
    session.teardown();
    set({
      devices: [],
      connectedDevice: null,
      activeSocket: null,
      isScanning: false,
      myIp: '',
      myDeviceName: '',
    });
  },

  connectToDevice: (device) => {
    session.connectToDevice({
      deviceName: device.deviceName,
      userName: device.userName,
      ipAddress: device.ip,
      port: device.port,
      onConnected: (client) =>
        set({ connectedDevice: device, activeSocket: client }),
      onError: (err) => console.log(`Connection error: ${err.message}`),
    });
  },

  disconnect: () => {
    get().activeSocket?.destroy?.();
    set({ connectedDevice: null, activeSocket: null });
  },
}));

export { session };
export default useSessionStore;
