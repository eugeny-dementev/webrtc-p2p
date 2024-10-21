import { assert } from "./assert.js";

let state = {
  socketId: null,

  localStream: null,
  remoteStream: null,

  screenSharingStream: null,
  screenSharingActive: false,

  allowConnectionsFromStrangers: false,

  // callState: ?
};

export const setSocketId = (socketId) => {
  assert.isString(socketId, 'socketId should be string');

  state = {
    ...state,
    socketId,
  };
}

export const setLocalStream = (stream) => {
  assert.isInstanceOf(stream, MediaStream, "local stream should be instance of MediaStream");

  state = {
    ...state,
    localStream: stream,
  };
};

export const setAllowConnectionFromStrangers = (allowConnections) => {
  assert.isBoolean(allowConnections, 'allowConnections should be boolean');

  state = {
    ...state,
    allowConnections,
  };
};

export const setScreenSharingActive = (screenSharingActive) => {
  assert.isBoolean(screenSharingActive, 'screenSharingActive should be boolean');

  state = {
    ...state,
    screenSharingActive,
  };
};

export const setScreenSharingStream = (stream) => {
  assert.isInstanceOf(stream, MediaStream, "screen sharing stream should be instance of MediaStream");

  state = {
    ...state,
    screenSharingStream: stream,
  };
};


export const setRemoteStream = (stream) => {
  assert.isInstanceOf(stream, MediaStream, "remote stream should be instance of MediaStream");

  state = {
    ...state,
    remoteStream: stream,
  };
};

export const getState = () => state
