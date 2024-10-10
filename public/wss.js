import { assert } from './assert.js';
import { callType } from './constants.js';

export const socket = io('/');

export function subscribeToSocketEvent(event, listener) {
  assert.isString(event, 'event should be a string');
  assert.isFunction(listener, 'listener should be a function');

  socket.on(event, listener);
}

/**
 *
 * @param data {object}
 * @param data.callType {string}
 * @param data.calleePersonalCode {string}
 */
export function sendPreOffer(data) {
  assert.oneOf(data.callType, Object.values(callType));
  assert.isString(data.calleePersonalCode, 'data.calleePersonalCode should be a string');

  socket.emit('pre-offer', data);
}
