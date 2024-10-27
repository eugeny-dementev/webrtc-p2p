import { inject, injectable } from "inversify";
import { Socket } from "socket.io-client";
import { assert } from "../common/assert";
import { CALL_TYPE, frontToBack, SIGNALING_EVENT } from "../common/constants";
import { PreAnswerForCaller, PreOfferFromCaller } from "../common/types";
import { TOKEN } from "./tokens";
@injectable()
export class CallerSignaling {
  constructor(@inject(TOKEN.Socket) private readonly socket: Socket) { }

  emitPreOfferToCallee(callType: CALL_TYPE, targetSocketId: Socket['id']) {
    assert.oneOf(callType, Object.values(CALL_TYPE));
    assert.isString(targetSocketId, 'targetSocketId should be a non-empty Socket["id"] string');

    const payload: PreOfferFromCaller = {
      ...frontToBack,
      callType,
      calleePersonalCode: targetSocketId,
    };

    this.socket.emit(SIGNALING_EVENT.PRE_OFFER_FROM_CALLER, payload);
  }
  subscribeToPreAnswerFromCallee(callback: (payload: PreAnswerForCaller) => void) {
    this.socket.on(SIGNALING_EVENT.PRE_ANSWER_FOR_CALLER, (payload: PreAnswerForCaller) => {
      assert.is(payload.from, 'back', 'handlePreOffer should always to receive events from the back');
      assert.is(payload.to, 'front', 'handlePreOffer should always to receive events targeted to the front');

      return callback(payload);
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
