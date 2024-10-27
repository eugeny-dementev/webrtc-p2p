import { assert } from "../common/assert";
import { CALL_TYPE, PreOfferAnswer } from "../common/constants";
import { PreAnswerForCaller } from "../common/types";
import { CallerSignaling } from "./CallerSignaling";
import { container } from "./di";
import { TOKEN } from "./tokens";
import * as ui from './ui';

let connectedUserDetails: { callType: any; socketId: any; };

export function sendPreOffer(calleePersonalCode: string, callType: CALL_TYPE) {
  assert.isString(calleePersonalCode, 'offer code should be a string');
  assert.oneOf(callType, Object.values(CALL_TYPE));

  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode,
  }

  if (callType === CALL_TYPE.PersonalChat || callType === CALL_TYPE.PersonalCall) {

    ui.showCallingDialog(cancelCallHandler);

    const callerSignaling = container.get<CallerSignaling>(TOKEN.CallerSignaling);
    callerSignaling.emitPreOfferToCallee(callType, calleePersonalCode);
  }
}

function cancelCallHandler() {
  console.log('cancelCallHandler()');
}

export function handlePreOfferAnswer(data: PreAnswerForCaller) {
  assert.oneOf(data.preOfferAnswer, Object.values(PreOfferAnswer));

  switch (data.preOfferAnswer) {
    case PreOfferAnswer.CalleeUnavailable:
    case PreOfferAnswer.CalleeNotFound:
    case PreOfferAnswer.CallRejected: {
      ui.showInfoDialog(data.preOfferAnswer);
      break;
    }
    case PreOfferAnswer.CallAccepted: {
      ui.removeAllDialogs();
      ui.showCallElements(connectedUserDetails.callType);
      break;
    };
    default: {
      ui.removeAllDialogs();
      throw new TypeError('Improsible pre offer answer value' + data.preOfferAnswer);
    }
  }
}
