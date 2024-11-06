import { inject, injectable } from "inversify";
import { assert } from "../common/assert";
import { CALL_TYPE, PreOfferAnswer } from "../common/constants";
import { ILogger } from "../common/Logger";
import { OfferForCallee, PreOfferForCallee } from "../common/types";
import { CalleeSignaling } from "./CalleeSignaling";
import { Peer } from "./Peer";
import { Store } from "./store";
import { TOKEN } from "./tokens";
import { UI } from "./ui";

@injectable()
export class CalleeEventsHandler {
  constructor(
    @inject(TOKEN.CalleeSignaling) private readonly callee: CalleeSignaling,
    @inject(TOKEN.Peer) private readonly peer: Peer,
    @inject(TOKEN.Store) private readonly store: Store,
    @inject(TOKEN.UI) private readonly ui: UI,
    @inject(TOKEN.Logger) private readonly logger: ILogger,
  ) { }

  subscribe() {
    this.callee.subscribeToPreOfferFromCaller((payload: PreOfferForCallee) => {
      this.handlePreOffer(payload);
    })
    this.callee.subscribeToOfferFromCaller((payload) => {
      this.handleOffer(payload);
    })
    this.callee.subscribeToIceCandidatesFromCaller((payload) => {
      this.peer
        .addIceCandidate(payload.candidate)
        .catch((error) => this.logger.error('Failed to add ice candidate from caller to peer connection', {
          error,
        }));
    });
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
          this.peer.init();
        },
        () => {
          this.callee.emitPreAnswerToCaller(PreOfferAnswer.CallRejected);
        },
      );
    }
  }

  handleOffer(payload: OfferForCallee) {
    this.peer
      .createAnswer(payload.offer)
      .then((answer) => {
        this.callee.emitAnswerToCaller(answer)
      })
      .catch((error) => this.logger.error('Failed to create answer to the offer', {
        error,
      }));
  }
}
