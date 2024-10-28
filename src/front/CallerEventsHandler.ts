import { inject, injectable } from "inversify";
import { assert } from "../common/assert";
import { PreOfferAnswer } from "../common/constants";
import { PreAnswerForCaller } from "../common/types";
import { CallerSignaling } from "./CallerSignaling";
import { Store } from "./store";
import { TOKEN } from "./tokens";
import { UI } from "./ui";

@injectable()
export class CallerEventsHandler {
  constructor(
    @inject(TOKEN.CallerSignaling) private readonly caller: CallerSignaling,
    @inject(TOKEN.Store) private readonly store: Store,
    @inject(TOKEN.UI) private readonly ui: UI,
  ) { }

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
        break;
      }
      case PreOfferAnswer.CallAccepted: {
        alert('call accepted')
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

