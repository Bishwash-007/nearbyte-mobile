import * as Device from 'expo-device';
import * as Network from 'expo-network';
import { Platform } from 'react-native';

import { DiscoveredDevice, DiscoveryService } from './discovery';
import { type ConnectOptions, TcpService } from './tcp';

interface SetupOptions {
  userName?: string;
  avatar?: string;
  onDeviceFound: (device: DiscoveredDevice) => void;
  onDeviceRemoved: (deviceName: string) => void;
  onServerConnection?: (socket: any) => void;
  onServerData?: (socket: any, data: Buffer | string) => void;
  onError?: (err: any) => void;
}

export class NearbySession {
  private tcp = new TcpService();
  private discovery: DiscoveryService | null = null;

  async setup({
    userName = '',
    avatar = '',
    onDeviceFound,
    onDeviceRemoved,
    onServerConnection,
    onServerData,
    onError,
  }: SetupOptions): Promise<{ ip: string; deviceName: string }> {
    const ip = await Network.getIpAddressAsync();
    const deviceName = Device.deviceName ?? `NearByte-${Platform.OS}`;

    this.tcp.startServer({
      onConnection: onServerConnection,
      onData: (socket, data) => onServerData?.(socket, data),
      onError,
    });

    this.discovery = new DiscoveryService(deviceName, userName, avatar);
    this.discovery.start({
      onDeviceFound,
      onDeviceRemoved,
      onError: onError ?? (() => {}),
    });

    return { ip, deviceName };
  }

  teardown(): void {
    this.discovery?.stop();
    this.tcp.stopServer();
  }

  connectToDevice(options: ConnectOptions): any {
    return this.tcp.connectToDevice(options);
  }
}

export type { DiscoveredDevice };
