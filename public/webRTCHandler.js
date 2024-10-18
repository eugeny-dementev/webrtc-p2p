import { assert } from "./assert.js";
import { CALL_TYPE, PRE_OFFER_ANSWER } from "./constants.js";
import * as ui from './ui.js';
import * as wss from './wss.js';

let connectedUserDetails;

export function sendPreOffer(calleePersonalCode, callType) {
  assert.isString(calleePersonalCode, 'offer code should be a string');
  assert.oneOf(callType, Object.values(CALL_TYPE));

  console.log('preOffer function run', calleePersonalCode, callType);

  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode,
    side: 'Sending',
  }

  if (callType === CALL_TYPE.PersonalChat || callType === CALL_TYPE.PersonalCall) {
    const data = {
      callType: callType,
      calleePersonalCode: calleePersonalCode,
      side: connectedUserDetails.side,
    };

    ui.showCallingDialog(cancelCallHandler);

    wss.sendPreOffer(data);
  }
}

/**
 * @param data {object}
 * @param data.callType {string}
 * @param data.callerPersonalCode {string}
 */
export function handlePreOffer(data) {
  assert.oneOf(data.callType, Object.values(CALL_TYPE));
  assert.isString(data.callerSocketId, 'data.callerSocketId should be a string');

  const { callType, callerSocketId } = data;

  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
    side: 'Receiving',
  };

  if (callType === CALL_TYPE.PersonalChat || callType === CALL_TYPE.PersonalCall) {
    ui.showIncomingCallingDialog(callType, acceptCallHandler, rejectCallHandler);
  }

  console.log('Callee received preOffer', connectedUserDetails);
}

function acceptCallHandler() {
  console.log('acceptCallHandler()');
  sendPreOfferAnswer(PRE_OFFER_ANSWER.CALL_ACCEPTED);
}

function rejectCallHandler() {
  console.log('rejectCallHandler()');
  sendPreOfferAnswer(PRE_OFFER_ANSWER.CALL_REJECTED);
}

function cancelCallHandler() {
  console.log('cancelCallHandler()');
}

function sendPreOfferAnswer(preOfferAnswer) {
  assert.oneOf(preOfferAnswer, Object.values(PRE_OFFER_ANSWER));

  const data = {
    callerSocketId: connectedUserDetails.socketId,
    side: connectedUserDetails.side,
    preOfferAnswer,
  };

  wss.sendPreOfferAnswer(data);
}

export function handlePreOfferAnswer(data) {
  assert.oneOf(data.preOfferAnswer, Object.values(PRE_OFFER_ANSWER));

  console.log('preOfferAnswer came', data);

  if (data.preOfferAnswer === PRE_OFFER_ANSWER.CALLEE_NOT_FOUND) {
    // show dialog that callee not found
    return;
  }

  if (data.preOfferAnswer === PRE_OFFER_ANSWER.CALL_UNAVAILABLE) {
    // callee unable to connect
    return;
  }

  if (data.preOfferAnswer === PRE_OFFER_ANSWER.CALL_REJECTED) {
    // call rejected by callee
    return;
  }

  if (data.preOfferAnswer !== PRE_OFFER_ANSWER.CALL_ACCEPTED) {
    throw new TypeError('Improsible pre offer answer value', data.preOfferAnswer);
  }

  // assuming pre-offer is CALL_ACCEPTED
  // send webRTC offer
}
