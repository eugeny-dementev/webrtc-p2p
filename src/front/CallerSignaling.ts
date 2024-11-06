import { inject, injectable } from "inversify";
import { Socket } from "socket.io-client";
import { assert } from "../common/assert";
import { CALL_TYPE, frontToBack, SIGNALING_EVENT } from "../common/constants";
import { AnswerForCaller, IceCandidateBack, IceCandidateFront, OfferFromCaller, PreAnswerForCaller, PreOfferFromCaller } from "../common/types";
import { Store } from "./store";
import { TOKEN } from "./tokens";

@injectable()
export class CallerSignaling {
  constructor(
    @inject(TOKEN.Socket) private readonly socket: Socket,
    @inject(TOKEN.Store) private readonly store: Store,
  ) { }

  emitIceCandidateToCallee(candidate: RTCIceCandidate, targetSocketId: Socket['id']) {
    assert.isString(targetSocketId, 'targetSocketId should be a non-empty Socket["id"] string');

    const payload: IceCandidateFront = {
      ...frontToBack,
      candidate,
      targetSocketId,
    };

    console.log(`Emitting ${SIGNALING_EVENT.ICE_CANDIDATE_FROM_CALLER}`, payload);

    this.socket.emit(SIGNALING_EVENT.ICE_CANDIDATE_FROM_CALLER, payload);
  }
  subscribeToIceCandidatesFromCallee(callback: (payload: IceCandidateBack) => void) {
    this.socket.on(SIGNALING_EVENT.ICE_CANDIDATE_FOR_CALLER, (payload: IceCandidateBack) =>{
      assert.is(this.store.socketId, payload.targetSocketId, 'Should only receive candidate for current socket id');

      console.log(`Received ${SIGNALING_EVENT.ICE_CANDIDATE_FOR_CALLER}`, payload);

      callback(payload);
    })
  }

  emitPreOfferToCallee(callType: CALL_TYPE, calleeSocketId: Socket['id']) {
    assert.oneOf(callType, Object.values(CALL_TYPE));
    assert.isString(calleeSocketId, 'calleeSocketId should be a non-empty Socket["id"] string');

    const payload: PreOfferFromCaller = {
      ...frontToBack,
      callType,
      calleePersonalCode: calleeSocketId,
    };

    console.log(`Emitting ${SIGNALING_EVENT.PRE_OFFER_FROM_CALLER}`, payload);

    this.socket.emit(SIGNALING_EVENT.PRE_OFFER_FROM_CALLER, payload);
  }
  subscribeToPreAnswerFromCallee(callback: (payload: PreAnswerForCaller) => void) {
    this.socket.on(SIGNALING_EVENT.PRE_ANSWER_FOR_CALLER, (payload: PreAnswerForCaller) => {
      assert.is(payload.from, 'back', 'handlePreOffer should always to receive events from the back');
      assert.is(payload.to, 'front', 'handlePreOffer should always to receive events targeted to the front');

      console.log(`Received ${SIGNALING_EVENT.PRE_ANSWER_FOR_CALLER}`, payload);

      callback(payload);
    });
  }

  emitOfferToCallee(offer: RTCSessionDescriptionInit, calleeSocketId: Socket['id']) {
    const payload: OfferFromCaller = {
      offer,
      calleeSocketId,
      ...frontToBack,
    }

    console.log(`Emitting ${SIGNALING_EVENT.OFFER_FROM_CALLER}`, payload);

    this.socket.emit(SIGNALING_EVENT.OFFER_FROM_CALLER, payload);
  }
  subscribeToAnswerFromCallee(callback: (payload: AnswerForCaller) => void) {
    this.socket.on(SIGNALING_EVENT.ANSWER_FOR_CALLER, (payload: AnswerForCaller) => {
      assert.is(payload.from, 'back', 'handlePreOffer should always to receive events from the back');
      assert.is(payload.to, 'front', 'handlePreOffer should always to receive events targeted to the front');
      assert.is(payload.calleeSocketId, this.store.calleeSocketId, 'answer should be received from this.store.calleeSocketId');
      assert.isFalse(payload.answer === undefined, 'answer should be received');

      console.log(`Received ${SIGNALING_EVENT.ANSWER_FOR_CALLER}`, payload);

      callback(payload);
    });
  }
}
