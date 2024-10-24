const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const assert = require('./assert');
const { PRE_OFFER_ANSWER } = require('./constants');

const PORT = process.env.PORT || 3030;

const app = express();

app.use(cors());
app.use(express.static('public'));

const server = http.createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

const connectedPeers = new Set();

io.on('connection', (socket) => {
  connectedPeers.add(socket.id);
  console.log('user connected to Socket.IO server', socket.id);
  console.log('connectedPeers', connectedPeers);

  socket.on('pre-offer', (data) => {
    assert.isString(data.callType, 'data.preOfferAnswer should be a string: ' + data.preOfferAnswer);
    assert.isString(data.calleePersonalCode, 'data.callerSocketId should be a string' + data.callerSocketId);
    assert.isFalse(socket.id === data.calleePersonalCode, 'Socket.id should never be equal to data.calleePersonalCode');

    console.log('pre-offer from', socket.id, data);

    if (!connectedPeers.has(data.calleePersonalCode)) {
      io.to(socket.id).emit('pre-offer-answer', {
        preOfferAnswer: PRE_OFFER_ANSWER.CALLEE_NOT_FOUND,
      });

      return;
    }

    const calleePayload = {
      callerSocketId: socket.id,
      callType: data.callType,
      side: data.side,
    };

    console.log('sending offer to callee:', calleePayload);
    io.to(data.calleePersonalCode).emit('pre-offer', calleePayload);
  });

  socket.on('pre-offer-answer', (data) => {
    assert.isString(data.preOfferAnswer, 'data.preOfferAnswer should be a string: ' + data.preOfferAnswer);
    assert.isString(data.callerSocketId, 'data.callerSocketId should be a string' + data.callerSocketId);
    assert.isFalse(socket.id === data.callerSocketId, 'pre-offer-answer should not came to server from callerSocketId');

    console.log('pre-offer-answer received:', data);

    if (!connectedPeers.has(data.callerSocketId)) {
      console.log('Caller not found', data.callerSocketId);
      return;
    }

    io.to(data.callerSocketId).emit('pre-offer-answer', data);
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
