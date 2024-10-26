import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { assert } from '../common/assert';
import { PRE_OFFER_ANSWER } from '../common/constants';
import { event } from '../common/helpers';
import { CalleePreAnswer, CalleePreOffer } from '../common/types';

const PORT = process.env.PORT || 3030;

const app = express();

app.use(cors());
app.use(express.static('public'));

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: true });

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

const connectedPeers = new Set();

io.on('connection', (socket) => {
  connectedPeers.add(socket.id);
  console.log('user connected to Socket.IO server', socket.id);
  console.log('connectedPeers', connectedPeers);

  socket.on(event('pre-offer').from('front').to('back'), (data) => {
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

    const calleePayload: CalleePreOffer = {
      callerSocketId: socket.id,
      callType: data.callType,
      from: 'back',
      to: 'front',
    };

    console.log('sending offer to callee:', calleePayload);
    io.to(data.calleePersonalCode).emit(event('pre-offer').from('back').to('front'), calleePayload);
  });

  socket.on(event('pre-offer-answer').from('front').to('back'), (data: CalleePreAnswer) => {
    assert.isString(data.preOfferAnswer, 'data.preOfferAnswer should be a string: ' + data.preOfferAnswer);
    assert.isString(data.callerSocketId, 'data.callerSocketId should be a string' + data.callerSocketId);
    assert.isFalse(socket.id === data.callerSocketId, 'pre-offer-answer should not came to server from callerSocketId');

    console.log('pre-offer-answer received:', data);

    if (!connectedPeers.has(data.callerSocketId)) {
      console.log('Caller not found', data.callerSocketId);
      return;
    }

    data.from = 'back';
    data.to = 'front';

    io.to(data.callerSocketId).emit(event('pre-offer-answer').from('back').to('front'), data);
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
