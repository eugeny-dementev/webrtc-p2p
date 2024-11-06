import { inject, injectable } from "inversify";
import { assert } from "../common/assert";
import { CALL_TYPE, PreOfferAnswer } from "../common/constants";
import { PreAnswerForCaller } from "../common/types";
import { Peer } from "./Peer";
import { CallerSignaling } from "./CallerSignaling";
import { Store } from "./store";
import { TOKEN } from "./tokens";
import { UI } from "./ui";
import { ILogger } from "../common/Logger";

@injectable()
export class CallerEventsHandler {
  constructor(
    @inject(TOKEN.CallerSignaling) private readonly caller: CallerSignaling,
    @inject(TOKEN.Peer) private readonly peer: Peer,
    @inject(TOKEN.Store) private readonly store: Store,
    @inject(TOKEN.UI) private readonly ui: UI,
    @inject(TOKEN.Logger) private readonly logger: ILogger,
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

  emitOfferToCallee() {
    console.log('State:', this.store.get());
    assert.isString(this.store.calleeSocketId, 'store.calleeSocketId should be set for sending offer');

    this.peer
      .createOffer()
      .then((offer) => {
        this.caller.emitOfferToCallee(offer, this.store.calleeSocketId);
      })
      .catch((error) => {
        this.peer.close();
        this.logger.error('Failed to create offer', { error });
      });
  }

  subscribe() {
    this.caller.subscribeToPreAnswerFromCallee((payload: PreAnswerForCaller) => {
      this.handlePreAnswer(payload);
    })
    this.caller.subscribeToAnswerFromCallee((payload) => {
      this.handleAnswer(payload);
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
        this.store.calleeSocketId = undefined;
        break;
      }
      case PreOfferAnswer.CallAccepted: {
        this.ui.showCallElements(this.store.callType);
        this.ui.removeDialog();
        this.peer.init();
        this.emitOfferToCallee();
        break;
      };
      default: {
        this.ui.removeDialog();
        throw new TypeError('Improsible pre offer answer value' + preOfferAnswer);
      }
    }
  }

  handleAnswer(payload) {
  }
}

