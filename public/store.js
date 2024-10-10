import { assert } from "./assert.js";

let state = {
  stocketId: null,

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
    socketId,
    ...state,
  };
}

export const setLocalStream = (stream) => {
  assert.isInstanceOf(stream, MediaStream, "local stream should be instance of MediaStream");

  state = {
    localStream: stream,
    ...state,
  };
};

export const setAllowConnectionFromStrangers = (allowConnections) => {
  assert.isBoolean(allowConnections, 'allowConnections should be boolean');

  state = {
    allowConnections,
    ...state,
  };
};

export const setScreenSharingActive = (screenSharingActive) => {
  assert.isBoolean(screenSharingActive, 'screenSharingActive should be boolean');

  state = {
    screenSharingActive,
    ...state,
  };
};

export const setScreenSharingStream = (stream) => {
  assert.isInstanceOf(stream, MediaStream, "screen sharing stream should be instance of MediaStream");

  state = {
    screenSharingStream: stream,
    ...state,
  };
};


export const setRemoteStream = (stream) => {
  assert.isInstanceOf(stream, MediaStream, "remote stream should be instance of MediaStream");

  state = {
    remoteStream: stream,
    ...state,
  };
};

export const getState = () => state
