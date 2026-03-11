import Zeroconf from 'react-native-zeroconf';

const DEFAULT_PORT = 9876;

export interface DiscoveredDevice {
  deviceName: string;
  userName: string;
  ip: string;
  port: number;
  avatar: string;
}

export interface DeviceFoundCallback {
  onDeviceFound: (device: DiscoveredDevice) => void;
  onDeviceRemoved: (deviceName: string) => void;
  onError: (err: any) => void;
}

export class DiscoveryService {
  private zeroconf: InstanceType<typeof Zeroconf>;
  private myDeviceName: string;
  private userName: string;
  private avatar: string;
  private serviceType: string;

  constructor(
    myDeviceName: string,
    userName = '',
    avatar = '',
    serviceType = 'nearbyte',
  ) {
    this.zeroconf = new Zeroconf();
    this.myDeviceName = myDeviceName;
    this.userName = userName;
    this.avatar = avatar;
    this.serviceType = serviceType;
  }

  start({
    onDeviceFound,
    onDeviceRemoved,
    onError,
  }: DeviceFoundCallback): void {
    this.zeroconf.removeDeviceListeners();

    this.zeroconf.publishService(
      this.serviceType,
      'tcp',
      'local.',
      this.myDeviceName,
      DEFAULT_PORT,
      { userName: this.userName, avatar: this.avatar },
    );

    this.zeroconf.on('resolved', (service: any) => {
      if (service.name === this.myDeviceName) return;
      const ip =
        (service.addresses as string[]).find((a) => a.includes('.')) ?? '';
      onDeviceFound({
        deviceName: service.name,
        userName: service.txt?.userName ?? service.name,
        ip,
        port: service.port,
        avatar: service.txt?.avatar ?? '',
      });
    });

    this.zeroconf.on('remove', (name: string) => onDeviceRemoved(name));
    this.zeroconf.on('error', (err: any) => onError(err));

    this.zeroconf.scan(this.serviceType, 'tcp', 'local.', 'DNSSD');
  }

  stop(): void {
    this.zeroconf.stop('DNSSD');
    this.zeroconf.unpublishService(this.myDeviceName);
    this.zeroconf.removeDeviceListeners();
  }
}
