import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { assert } from '../common/assert';
import { PreOfferAnswer, SIGNALING_EVENT } from '../common/constants';
import { event } from '../common/helpers';
import {
  PreAnswerForCaller, PreAnswerFromCallee, PreOfferForCallee, PreOfferFromCaller
} from '../common/types';

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
  console.log('connectedPeers', connectedPeers);

  socket.on(SIGNALING_EVENT.PRE_OFFER_FROM_CALLER, (data: PreOfferFromCaller) => {
    assert.isString(data.callType, 'data.preOfferAnswer should be a string: ' + data.callType);
    assert.isString(data.calleePersonalCode, 'data.callerSocketId should be a string' + data.calleePersonalCode);
    assert.isFalse(socket.id === data.calleePersonalCode, 'Socket.id should never be equal to data.calleePersonalCode');

    console.log(`Received ${SIGNALING_EVENT.PRE_OFFER_FROM_CALLER} from ${socket.id}`, data);

    if (!connectedPeers.has(data.calleePersonalCode)) {
      io.to(socket.id).emit('pre-offer-answer', {
        preOfferAnswer: PreOfferAnswer.CalleeNotFound,
      });

      return;
    }

    const payloadForCallee: PreOfferForCallee = {
      callerSocketId: socket.id,
      callType: data.callType,
      from: 'back',
      to: 'front',
    };

    console.log(`Emitting ${SIGNALING_EVENT.PRE_OFFER_FOR_CALLEE} to ${data.calleePersonalCode}`, payloadForCallee);

    io.to(data.calleePersonalCode).emit(SIGNALING_EVENT.PRE_OFFER_FOR_CALLEE, payloadForCallee);
  });

  socket.on(SIGNALING_EVENT.PRE_ANSWER_FROM_CALLEE, (data: PreAnswerFromCallee) => {
    assert.isString(data.preOfferAnswer, 'data.preOfferAnswer should be a string: ' + data.preOfferAnswer);
    assert.isString(data.callerSocketId, 'data.callerSocketId should be a string' + data.callerSocketId);
    assert.isFalse(socket.id === data.callerSocketId, 'pre-offer-answer should not came to server from callerSocketId');

    console.log(`Received ${SIGNALING_EVENT.PRE_ANSWER_FROM_CALLEE} from ${socket.id}`, data);

    if (!connectedPeers.has(data.callerSocketId)) {
      console.log('Caller not found', data.callerSocketId);
      return;
    }

    const payloadForCaller: PreAnswerForCaller = {
      ...data,
      from: 'back',
      to: 'front',
    };

    console.log(`Emitting ${SIGNALING_EVENT.PRE_ANSWER_FOR_CALLER} to ${data.callerSocketId}`, payloadForCaller);

    io.to(data.callerSocketId).emit(SIGNALING_EVENT.PRE_ANSWER_FOR_CALLER, payloadForCaller);
  });

  socket.on(SIGNALING_EVENT.ICE_CANDIDATE_FROM_CALLER, (data) => {
    const { targetSocketId, candidate } = data;

    console.log(`Received ${SIGNALING_EVENT.ICE_CANDIDATE_FROM_CALLER} from ${socket.id}`, data);

    if (!connectedPeers.has(targetSocketId)) {
      console.log('Caller not found', targetSocketId);
      return;
    }

    const payload = {
      ...data,
      from: 'back',
      to: 'front',
    }

    io.to(targetSocketId).emit(SIGNALING_EVENT.ICE_CANDIDATE_FOR_CALLEE, payload);
  });

  socket.on(SIGNALING_EVENT.ICE_CANDIDATE_FROM_CALLEE, (data) => {
    const { targetSocketId } = data;

    console.log(`Received ${SIGNALING_EVENT.ICE_CANDIDATE_FROM_CALLEE} from ${socket.id}`, data);

    if (!connectedPeers.has(targetSocketId)) {
      console.log('Caller not found', targetSocketId);
      return;
    }

    const payload = {
      ...data,
      callerSockerId: socket.id,
      from: 'back',
      to: 'front',
    }

    io.to(targetSocketId).emit(SIGNALING_EVENT.ICE_CANDIDATE_FOR_CALLER, payload);
  });

  socket.on(SIGNALING_EVENT.OFFER_FROM_CALLER, (data) => {
    const { targetSocketId } = data;

    console.log(`Received ${SIGNALING_EVENT.OFFER_FROM_CALLER} from ${socket.id}`, data);

    if (!connectedPeers.has(targetSocketId)) {
      console.log('Caller not found', targetSocketId);
      return;
    }

    const payload = {
      ...data,
      callerSockerId: socket.id,
      from: 'back',
      to: 'front',
    }

    io.to(targetSocketId).emit(SIGNALING_EVENT.OFFER_FOR_CALLEE, payload);
  });

  socket.on(SIGNALING_EVENT.ANSWER_FROM_CALLEE, (data) => {
    const { targetSocketId } = data;

    console.log(`Received ${SIGNALING_EVENT.ANSWER_FROM_CALLEE} from ${socket.id}`, data);

    if (!connectedPeers.has(targetSocketId)) {
      console.log('Caller not found', targetSocketId);
      return;
    }

    const payload = {
      ...data,
      calleeSocketId: socket.id,
      from: 'back',
      to: 'front',
    }

    io.to(targetSocketId).emit(SIGNALING_EVENT.ANSWER_FOR_CALLER, payload);
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
