import { inject, injectable } from "inversify";
import { assert } from "../common/assert";
import { CALL_TYPE, PreOfferAnswer } from "../common/constants";
import { PreAnswerForCaller } from "../common/types";
import { CallerPeer } from "./CallerPeer";
import { CallerSignaling } from "./CallerSignaling";
import { Store } from "./store";
import { TOKEN } from "./tokens";
import { UI } from "./ui";

@injectable()
export class CallerEventsHandler {
  constructor(
    @inject(TOKEN.CallerSignaling) private readonly caller: CallerSignaling,
    @inject(TOKEN.CallerPeer) private readonly callerPeer: CallerPeer,
    @inject(TOKEN.Store) private readonly store: Store,
    @inject(TOKEN.UI) private readonly ui: UI,
  ) { }

  emitPreOffer(calleePersonalCode: string, callType: CALL_TYPE) {
    assert.isString(calleePersonalCode, 'offer code should be a string');
    assert.oneOf(callType, Object.values(CALL_TYPE));

    if (callType === CALL_TYPE.PersonalChat || callType === CALL_TYPE.PersonalCall) {

      this.store.callType = callType;

      this.ui.showCallingDialog(() => {
        this.store.callType = undefined;
        console.log('Caller canceled call');
      });

      this.caller.emitPreOfferToCallee(callType, calleePersonalCode);
    }
  }

  subscribe() {
    this.caller.subscribeToPreAnswerFromCallee((payload: PreAnswerForCaller) => {
      this.handlePreAnswer(payload);
    })
  }

  handlePreAnswer(payload: PreAnswerForCaller) {
    const { preOfferAnswer } = payload;

    assert.oneOf(preOfferAnswer, Object.values(PreOfferAnswer));

    switch (preOfferAnswer) {
      case PreOfferAnswer.CalleeUnavailable:
      case PreOfferAnswer.CalleeNotFound:
      case PreOfferAnswer.CallRejected: {
        this.ui.showInfoDialog(preOfferAnswer);
        this.store.targetSocketId = undefined;
        break;
      }
      case PreOfferAnswer.CallAccepted: {
        this.ui.showCallElements(this.store.callType);
        this.ui.removeDialog();
        break;
      };
      default: {
        this.ui.removeDialog();
        throw new TypeError('Improsible pre offer answer value' + preOfferAnswer);
      }
    }
  }
}

