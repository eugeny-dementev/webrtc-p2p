import { inject, injectable } from "inversify";
import { assert } from "../common/assert";
import { CALL_TYPE, PreOfferAnswer } from "../common/constants";
import { PreOfferForCallee } from "../common/types";
import { CalleeSignaling } from "./CalleeSignaling";
import { Store } from "./store";
import { TOKEN } from "./tokens";
import { UI } from "./ui";

@injectable()
export class CalleeEventsHandler {
  constructor(
    @inject(TOKEN.CalleeSignaling) private readonly callee: CalleeSignaling,
    @inject(TOKEN.Store) private readonly store: Store,
    @inject(TOKEN.UI) private readonly ui: UI,
  ) { }

  subscribe() {
    this.callee.subscribeToPreOfferFromCaller((payload: PreOfferForCallee) => {
      this.handlePreOffer(payload);
    })
  }

  handlePreOffer(payload: PreOfferForCallee) {
    assert.oneOf(payload.callType, Object.values(CALL_TYPE));
    assert.isString(payload.callerSocketId, 'data.callerSocketId should be a string');

    const { callType, callerSocketId } = payload;

    this.store.callerSocketId = callerSocketId;

    if (callType === CALL_TYPE.PersonalChat || callType === CALL_TYPE.PersonalCall) {
      this.ui.showIncomingCallingDialog(
        callType,
        () => {
          this.callee.emitPreAnswerToCaller(PreOfferAnswer.CallAccepted);
          this.ui.showCallElements(payload.callType);

        },
        () => {
          this.callee.emitPreAnswerToCaller(PreOfferAnswer.CallRejected);
        },
      );
    }
  }
}
