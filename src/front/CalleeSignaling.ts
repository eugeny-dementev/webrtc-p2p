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

  onPreOfferFromCaller(callback: (payload: PreOfferForCallee) => void) {
    this.socket.on(SIGNALING_EVENT.PRE_OFFER_FOR_CALLEE, (payload: PreOfferForCallee) => {
      assert.isFalse(payload.callerSocketId === this.store.socketId, 'PreOffer should never came from the same socket id');

      this.store.callerSocketId = payload.callerSocketId;

      return callback(payload);
    });
  }
  emitPreAnswerToCaller(preOfferAnswer: PreOfferAnswer) {
    const payload: PreAnswerFromCallee = {
      ...frontToBack,
      callerSocketId: this.store.callerSocketId,
      preOfferAnswer,
    }

    this.socket.emit(SIGNALING_EVENT.PRE_ANSWER_FROM_CALLEE, payload);
  }

  // onOfferFromCaller(callback) { }
  // emitAnswerToCaller(data) { }
}
