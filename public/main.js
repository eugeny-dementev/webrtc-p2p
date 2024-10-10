import * as store from './store.js'

const socket = io('/');

socket.on('connect', () => {
  console.log('success connection to socket.io server with id:', socket.id);
  store.setSocketId(socket.id);

  console.log('state:', store.getState())
});
