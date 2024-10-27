import { injectable } from "inversify";
import { io, Socket } from "socket.io-client";


//@ts-ignore
export const socket = io('http://localhost:3030', {
  transports: ['websocket', 'polling'],
  upgrade: true,
});

type OnConnectCallback = () => void;

@injectable()
export class SocketClient {
  private readonly socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3030', {
      transports: ['websocket', 'polling'],
      upgrade: true,
    });
  }

  get id(): string {
    return this.socket.id;
  }

  onConnect(callback: OnConnectCallback) {
    this.socket.on('connect', callback);
  }

  on(event: string, listener: (...args: any[]) => void) {
    this.socket.on(event, listener);
  }

  async emit<T>(event: string, data: T) {
    return this.socket.emit(event, data);
  }

  // in case connection is about to change we need maybe to
  // cleanup old listeners bounded to socket instance
  async reset() {
  }
}
