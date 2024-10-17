import { assert } from "./assert.js";
import { CALL_TYPE } from "./constants.js";
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
  }

  if (callType === CALL_TYPE.PersonalChat || callType === CALL_TYPE.PersonalCall) {
    const data = {
      callType: callType,
      calleePersonalCode: calleePersonalCode,
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

  const connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  if (callType === CALL_TYPE.PersonalChat || callType === CALL_TYPE.PersonalCall) {
    ui.showIncomingCallingDialog(callType, acceptCallHandler, rejectCallHandler);
  }

  console.log('Callee received preOffer', connectedUserDetails);
}

function acceptCallHandler() {
  console.log('acceptCallHandler()');
}
function rejectCallHandler() {
  console.log('rejectCallHandler()');
}
function cancelCallHandler() {
  console.log('cancelCallHandler()');
}
