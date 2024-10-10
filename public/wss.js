import { assert } from './assert.js';

export const socket = io('/');

export function subscribeToSocketEvent(event, listener) {
  assert.isString(event, 'event should be a string');
  assert.isFunction(listener, 'listener should be a function');

  socket.on(event, listener);
}
