import { assert } from './assert';
import { CALL_TYPE } from './constants';

//@ts-ignore
export const socket = io('http://localhost:3030', {
  transports: ['websocket', 'polling'],
  upgrade: true,
});

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
  assert.oneOf(data.callType, Object.values(CALL_TYPE));
  assert.isString(data.calleePersonalCode, 'data.calleePersonalCode should be a string');

  console.log('Emitting pre-offer from', socket.id, data);

  socket.emit('pre-offer', data);
}

export function sendPreOfferAnswer(data) {
  assert.isString(data.preOfferAnswer, 'data.preOfferAnswer should be a string');
  assert.isString(data.callerSocketId, 'data.callerSocketId should be a string');

  socket.emit('pre-offer-answer', data);
}
