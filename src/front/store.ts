import { injectable } from "inversify";
import { assert } from "../common/assert";

type State = {
  socketId: string;
  callerSocketId: string | undefined;

  localStream: MediaStream | null;
  remoteStream: MediaStream | null;

  screenSharingStream: MediaStream | null;
  screenSharingActive: boolean;

  allowConnectionsFromStrangers: boolean;

  // callState: ?
}

@injectable()
export class Store {
  private state: State = Object.freeze({
    socketId: null,
    callerSocketId: undefined,

    localStream: null,
    remoteStream: null,

    screenSharingStream: null,
    screenSharingActive: false,

    allowConnectionsFromStrangers: false,

    // callState: ?
  });

  // Connection
  set socketId(value: string) {
    assert.isString(value, 'socketId should be string');

    this.state = Object.freeze({ ...this.state, socketId: value })
  }
  get socketId(): string {
    return this.state.socketId;
  }
  set callerSocketId(value: string | undefined) {
    this.state = Object.freeze({ ...this.state, callerSocketId: value })
  }
  get callerSocketId() {
    return this.state.callerSocketId;
  }

  // Streams
  set localStream(value: State['localStream']) {
    this.state = Object.freeze({ ...this.state, localStream: value, });
  }
  get localStream(): State['localStream'] {
    return this.state.localStream;
  }
  set remoteStream(value: State['localStream']) {
    this.state = Object.freeze({ ...this.state, remoteStream: value, });
  }
  get remoteStream(): State['localStream'] {
    return this.state.remoteStream;
  }
  set screenSharingStream(value: State['localStream']) {
    this.state = Object.freeze({ ...this.state, screenSharingStream: value, });
  }
  get screenSharingStream(): State['localStream'] {
    return this.state.screenSharingStream;
  }

  // Flags
  set screenSharingActive(value: boolean) {
    this.state = Object.freeze({ ...this.state, screenSharingActive: value, });
  }
  get screenSharingActive(): boolean {
    return this.state.screenSharingActive;
  }
  set allowConnectionsFromStrangers(value: boolean) {
    this.state = Object.freeze({ ...this.state, allowConnectionsFromStrangers: value, });
  }
  get allowConnectionsFromStrangers(): boolean {
    return this.state.allowConnectionsFromStrangers;
  }
}
