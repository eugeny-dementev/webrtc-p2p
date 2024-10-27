import { assert } from "../common/assert";
import { CALL_TYPE, PreOfferAnswer } from "../common/constants";
import { PreAnswerForCaller, PreOfferForCallee } from "../common/types";
import { CalleeSignaling } from "./CalleeSignaling";
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

/**
 * @param data {object}
 * @param data.callType {string}
 * @param data.callerPersonalCode {string}
 */
export function handlePreOffer(data: PreOfferForCallee) {
  assert.oneOf(data.callType, Object.values(CALL_TYPE));
  assert.isString(data.callerSocketId, 'data.callerSocketId should be a string');
  assert.is(data.from, 'back', 'handlePreOffer should always to receive events from the back');
  assert.is(data.to, 'front', 'handlePreOffer should always to receive events targeted to the front');

  const { callType, callerSocketId } = data;

  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  if (callType === CALL_TYPE.PersonalChat || callType === CALL_TYPE.PersonalCall) {
    ui.showIncomingCallingDialog(callType, acceptCallHandler, rejectCallHandler);
  }
}

function acceptCallHandler() {
  console.log('acceptCallHandler()');
  sendPreOfferAnswer(PreOfferAnswer.CallAccepted);
  ui.showCallElements(connectedUserDetails.callType);
}

function rejectCallHandler() {
  console.log('rejectCallHandler()');
  sendPreOfferAnswer(PreOfferAnswer.CallRejected);
}

function cancelCallHandler() {
  console.log('cancelCallHandler()');
}

function sendPreOfferAnswer(preOfferAnswer: PreOfferAnswer) {
  assert.oneOf(preOfferAnswer, Object.values(PreOfferAnswer));

  ui.removeAllDialogs();

  const calleeSignaling = container.get<CalleeSignaling>(TOKEN.CalleeSignaling);
  calleeSignaling.emitPreAnswerToCaller(preOfferAnswer);
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
