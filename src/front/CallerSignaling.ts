import { inject, injectable } from "inversify";
import { Socket } from "socket.io-client";
import { assert } from "../common/assert";
import { CALL_TYPE, frontToBack, SIGNALING_EVENT } from "../common/constants";
import { AnswerForCaller, OfferFromCaller, PreAnswerForCaller, PreOfferFromCaller } from "../common/types";
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

    const payload = {
      ...frontToBack,
      iceCandidate: candidate,
      targetSocketId,
    };

    this.socket.emit(SIGNALING_EVENT.ICE_CANDIDATE_FROM_CALLER, payload);
  }

  emitPreOfferToCallee(callType: CALL_TYPE, targetSocketId: Socket['id']) {
    assert.oneOf(callType, Object.values(CALL_TYPE));
    assert.isString(targetSocketId, 'targetSocketId should be a non-empty Socket["id"] string');

    const payload: PreOfferFromCaller = {
      ...frontToBack,
      callType,
      calleePersonalCode: targetSocketId,
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

  emitOfferToCallee(offer: RTCSessionDescriptionInit, targetSocketId: Socket['id']) {
    const payload: OfferFromCaller = {
      offer,
      calleeSocketId: targetSocketId,
      ...frontToBack,
    }

    this.socket.emit(SIGNALING_EVENT.OFFER_FROM_CALLER, payload);
  }
  subscribeToAnswerFromCallee(callback: (payload: AnswerForCaller) => void) {
    this.socket.on(SIGNALING_EVENT.ANSWER_FOR_CALLER, (payload) => {
      assert.is(payload.from, 'back', 'handlePreOffer should always to receive events from the back');
      assert.is(payload.to, 'front', 'handlePreOffer should always to receive events targeted to the front');
      assert.is(payload.calleeSocketId, this.store.targetSocketId, 'answer should be received from this.store.targetSocketId');

      console.log(`Received ${SIGNALING_EVENT.PRE_ANSWER_FOR_CALLER}`, payload);

      callback(payload);
    });
  }

  // emitOfferToCallee(data) {
  //   const payload = {
  //     ...frontToBack
  //   }
  // }
  // onAnswerFromCallee(callback) {
  // }
}
