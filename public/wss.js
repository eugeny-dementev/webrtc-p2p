import { assert } from './assert.js';
import * as store from './store.js'
import * as ui from './ui.js'

const socket = io('/');

export function subscribeToSocketEvent(event, listener) {
  assert.isString(event, 'event should be a string');
  assert.isFunction(listener, 'listener should be a function');

  socket.on(event, listener);
}

subscribeToSocketEvent('connect', () => {
  console.log('success connection to socket.io server with id:', socket.id);
  store.setSocketId(socket.id);
  ui.updatePersonalCode(socket.id);
});


