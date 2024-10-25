import { assert } from '../common/assert';
import { CALL_TYPE } from '../common/constants';
import { event } from '../common/helpers';
import { CalleePreAnswer, CallerPreOffer } from '../common/types';

//@ts-ignore
export const socket = io('http://localhost:3030', {
  transports: ['websocket', 'polling'],
  upgrade: true,
});

export function subscribeToSocketEvent(event: string, listener: any) {
  assert.isString(event, 'event should be a string');
  assert.isFunction(listener, 'listener should be a function');

  socket.on(event, (...args: any[]) => {
    console.log(`Event ${event} received with payload`, ...args);
    return listener(...args);
  });
}

export function sendPreOffer(data: CallerPreOffer) {
  assert.oneOf(data.callType, Object.values(CALL_TYPE));
  assert.isString(data.calleePersonalCode, 'data.calleePersonalCode should be a string');
  assert.is(data.from, 'front', 'Always from front to back');
  assert.is(data.to, 'back', 'Always from front to back');

  const eventType = event('pre-offer').from('front').to('back');
  console.log(`Emitting ${eventType} with payload:`, data);

  socket.emit(eventType, data);
}

export function sendPreOfferAnswer(data: CalleePreAnswer) {
  assert.isString(data.preOfferAnswer, 'data.preOfferAnswer should be a string');
  assert.isString(data.callerSocketId, 'data.callerSocketId should be a string');
  assert.is(data.from, 'front', 'Always from front to back');
  assert.is(data.to, 'back', 'Always from front to back');

  const eventType = event('pre-offer-answer').from('front').to('back')

  console.log(`Emitting ${eventType} with payload:`, data);

  socket.emit(eventType, data);
}
