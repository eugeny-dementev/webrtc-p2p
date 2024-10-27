import { inject, injectable } from "inversify";
import { Socket } from "socket.io-client";
import { frontToBack, PRE_OFFER_ANSWER, SIGNALING_EVENT } from "../common/constants";
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
    this.socket.on(SIGNALING_EVENT.PRE_OFFER_FOR_CALLEE, callback);
  }
  emitPreAnswerToCaller(preOfferAnswer: PRE_OFFER_ANSWER) {
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
