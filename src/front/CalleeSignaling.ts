import { inject, injectable } from "inversify";
import { Socket } from "socket.io-client";
import { assert } from "../common/assert";
import { frontToBack, PreOfferAnswer, SIGNALING_EVENT } from "../common/constants";
import { AnswerFromCallee, IceCandidateBack, IceCandidateFront, OfferForCallee, PreAnswerFromCallee, PreOfferForCallee } from "../common/types";
import { Store } from "./store";
import { TOKEN } from "./tokens";

@injectable()
export class CalleeSignaling {
  constructor(
    @inject(TOKEN.Socket) private readonly socket: Socket,
    @inject(TOKEN.Store) private readonly store: Store,
  ) { }

  subscribeToPreOfferFromCaller(callback: (payload: PreOfferForCallee) => void) {
    this.socket.on(SIGNALING_EVENT.PRE_OFFER_FOR_CALLEE, (payload: PreOfferForCallee) => {
      assert.is(payload.from, 'back', 'handlePreOffer should always to receive events from the back');
      assert.is(payload.to, 'front', 'handlePreOffer should always to receive events targeted to the front');
      assert.isFalse(payload.callerSocketId === this.store.socketId, 'PreOffer should never came from the same socket id');

      console.log(`Received ${SIGNALING_EVENT.PRE_OFFER_FOR_CALLEE}`, payload);

      return callback(payload);
    });
  }
  emitPreAnswerToCaller(preOfferAnswer: PreOfferAnswer) {
    const payload: PreAnswerFromCallee = {
      ...frontToBack,
      callerSocketId: this.store.callerSocketId,
      preOfferAnswer,
    }

    console.log(`Emitting ${SIGNALING_EVENT.PRE_ANSWER_FROM_CALLEE}`, payload);

    this.socket.emit(SIGNALING_EVENT.PRE_ANSWER_FROM_CALLEE, payload);
  }

  subscribeToOfferFromCaller(callback: (payload: OfferForCallee) => void) {
    this.socket.on(SIGNALING_EVENT.OFFER_FOR_CALLEE, (payload: OfferForCallee) => {
      assert.is(payload.from, 'back', 'handlePreOffer should always to receive events from the back');
      assert.is(payload.to, 'front', 'handlePreOffer should always to receive events targeted to the front');
      assert.isFalse(payload.callerSocketId === this.store.socketId, 'Offer should never came from the same socket id');
      assert.isFalse(payload.offer === undefined, 'Offer should be in the payload');

      console.log(`Received ${SIGNALING_EVENT.OFFER_FOR_CALLEE}`, payload);

      return callback(payload);
    });
  }
  emitAnswerToCaller(answer: RTCSessionDescriptionInit) {
    const payload: AnswerFromCallee = {
      ...frontToBack,
      callerSocketId: this.store.callerSocketId,
      answer,
    }

    console.log(`Emitting ${SIGNALING_EVENT.ANSWER_FROM_CALLEE}`, payload);

    this.socket.emit(SIGNALING_EVENT.ANSWER_FROM_CALLEE, payload);
  }

  subscribeToIceCandidatesFromCaller(callback: (payload: IceCandidateBack) => void) {
    this.socket.on(SIGNALING_EVENT.ICE_CANDIDATE_FOR_CALLEE, (payload: IceCandidateBack) => {
      assert.isFalse(this.store.socketId === payload.targetSocketId, 'Should only receive candidate from caller');

      console.log(`Received ${SIGNALING_EVENT.ICE_CANDIDATE_FOR_CALLEE}`, payload);

      callback(payload);
    })
  }
  emitIceCandidateToCaller(candidate: RTCIceCandidate, targetSocketId: Socket['id']) {
    assert.isString(targetSocketId, 'targetSocketId should be a non-empty Socket["id"] string');
    assert.is(targetSocketId, this.store.callerSocketId, 'should only emit ice candidates to caller');

    const payload: IceCandidateFront = {
      ...frontToBack,
      candidate,
      targetSocketId,
    };

    console.log(`Emitting ${SIGNALING_EVENT.ICE_CANDIDATE_FROM_CALLEE}`, payload);

    this.socket.emit(SIGNALING_EVENT.ICE_CANDIDATE_FROM_CALLEE, payload);
  }
}
