const express = require('express');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3030;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

const connectedPeers = new Set();

io.on('connection', (socket) => {
  connectedPeers.add(socket.id);
  console.log('user connected to Socket.IO server', socket.id);
  console.log('connectedPeers', connectedPeers);

  socket.on('pre-offer', (callerPayload) => {
    console.log('pre-offer:', callerPayload);

    if (!connectedPeers.has(callerPayload.calleePersonalCode)) {
      return;
    }

    const calleePayload = {
      callerSocketId: socket.id,
      callType: callerPayload.callType,
    };

    console.log('sending offer to callee:', calleePayload);
    io.to(callerPayload.calleePersonalCode).emit('pre-offer', calleePayload);
  });

  socket.on('disconnect', () => {
    connectedPeers.delete(socket.id);
    console.log('user disconnected to Socket.IO server', socket.id);
    console.log('connectedPeers', connectedPeers);
  });
});

server.listen(PORT, () => {
  console.log('Server is started on', PORT);
});
