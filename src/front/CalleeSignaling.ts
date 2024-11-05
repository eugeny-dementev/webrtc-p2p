import { inject, injectable } from "inversify";
import { Socket } from "socket.io-client";
import { assert } from "../common/assert";
import { frontToBack, PreOfferAnswer, SIGNALING_EVENT } from "../common/constants";
import { PreAnswerFromCallee, PreOfferForCallee } from "../common/types";
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

  subscribeToOfferFromCaller(callback: (payload) => void) {
    this.socket.on(SIGNALING_EVENT.OFFER_FOR_CALLEE, (payload) => {
      assert.is(payload.from, 'back', 'handlePreOffer should always to receive events from the back');
      assert.is(payload.to, 'front', 'handlePreOffer should always to receive events targeted to the front');
      assert.isFalse(payload.callerSocketId === this.store.socketId, 'PreOffer should never came from the same socket id');

      console.log(`Received ${SIGNALING_EVENT.OFFER_FOR_CALLEE}`, payload);

      return callback(payload);
    });
  }
  emitAnswerToCaller(answer) {
    const payload = {
      ...frontToBack,
      targetSocketId: this.store.callerSocketId,
      answer: {},
    }

    console.log(`Emitting ${SIGNALING_EVENT.ANSWER_FROM_CALLEE}`, payload);

    this.socket.emit(SIGNALING_EVENT.ANSWER_FROM_CALLEE, payload);
  }
}
