const socket = io('/');

socket.on('connect', () => {
  console.log('success connection to socket.io server with id:', socket.id);
});
