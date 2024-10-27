import { assert } from "../common/assert";
import { CALL_TYPE, PRE_OFFER_ANSWER } from "../common/constants";
import { PreAnswerFromCallee, PreOfferForCallee, PreOfferFromCaller, PreAnswerForCaller } from "../common/types";
import * as ui from './ui';
import * as wss from './wss';

let connectedUserDetails: { callType: any; socketId: any; };

export function sendPreOffer(calleePersonalCode: string, callType: CALL_TYPE) {
  assert.isString(calleePersonalCode, 'offer code should be a string');
  assert.oneOf(callType, Object.values(CALL_TYPE));

  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode,
  }

  if (callType === CALL_TYPE.PersonalChat || callType === CALL_TYPE.PersonalCall) {
    const data: PreOfferFromCaller = {
      callType: callType,
      calleePersonalCode: calleePersonalCode,
      from: 'front',
      to: 'back',
    };

    ui.showCallingDialog(cancelCallHandler);

    wss.getSocketConnection().then(socket => {
      wss.sendPreOffer(socket, data);
    })
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
  sendPreOfferAnswer(PRE_OFFER_ANSWER.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
}

function rejectCallHandler() {
  console.log('rejectCallHandler()');
  sendPreOfferAnswer(PRE_OFFER_ANSWER.CALL_REJECTED);
}

function cancelCallHandler() {
  console.log('cancelCallHandler()');
}

function sendPreOfferAnswer(preOfferAnswer: PRE_OFFER_ANSWER) {
  assert.oneOf(preOfferAnswer, Object.values(PRE_OFFER_ANSWER));

  const data: PreAnswerFromCallee = {
    callerSocketId: connectedUserDetails.socketId,
    preOfferAnswer,
    from: 'front',
    to: 'back',
  };

  ui.removeAllDialogs();
  wss.getSocketConnection().then(socket => {
    wss.sendPreOfferAnswer(socket, data);
  });
}

export function handlePreOfferAnswer(data: PreAnswerForCaller) {
  assert.oneOf(data.preOfferAnswer, Object.values(PRE_OFFER_ANSWER));

  switch (data.preOfferAnswer) {
    case PRE_OFFER_ANSWER.CALLEE_UNAVAILABLE:
    case PRE_OFFER_ANSWER.CALLEE_NOT_FOUND:
    case PRE_OFFER_ANSWER.CALL_REJECTED: {
      ui.showInfoDialog(data.preOfferAnswer);
      break;
    }
    case PRE_OFFER_ANSWER.CALL_ACCEPTED: {
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
