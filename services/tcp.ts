import TcpSocket from 'react-native-tcp-socket';

interface ServerOptions {
  onConnection?: (socket: any) => void;
  onData?: (socket: any, data: Buffer | string) => void;
  onError?: (err: Error) => void;
}

export interface ConnectOptions {
  deviceName: string;
  userName: string;
  ipAddress: string;
  port: number;
  onConnected?: (client: any) => void;
  onData?: (data: Buffer | string) => void;
  onError?: (err: Error) => void;
}

export class TcpService {
  private server: any = null;
  private readonly port: number;

  constructor(port = 9876) {
    this.port = port;
  }

  startServer({ onConnection, onData, onError }: ServerOptions): void {
    this.server = TcpSocket.createServer((socket: any) => {
      onConnection?.(socket);
      socket.on('data', (data: Buffer | string) => onData?.(socket, data));
      socket.on('close', () => console.log('Connection closed'));
      socket.on('error', (err: Error) =>
        console.log(`Socket error: ${err.message}`),
      );
    });

    this.server.on('error', (err: Error) => {
      console.log(`Server error: ${err.message}`);
      onError?.(err);
    });

    this.server.listen({ port: this.port, host: '0.0.0.0' }, () => {
      console.log(`TCP server listening on port ${this.port}`);
    });
  }

  stopServer(): void {
    this.server?.close();
    this.server = null;
  }

  connectToDevice({
    userName,
    deviceName,
    ipAddress,
    port,
    onConnected,
    onData,
    onError,
  }: ConnectOptions): any {
    const client = TcpSocket.createConnection({ host: ipAddress, port }, () => {
      console.log(`Connected to ${userName}'s ${deviceName}!`);
      onConnected?.(client);
    });

    if (onData) client.on('data', (data) => onData(data));
    client.on('close', () =>
      console.log(`Disconnected from ${userName}'s ${deviceName}`),
    );
    client.on('error', (err: Error) => {
      console.log(`Connection error: ${err.message}`);
      onError?.(err);
    });

    return client;
  }
}
