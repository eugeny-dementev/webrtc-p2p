import { assert } from "./assert.js";
import { CALL_TYPE } from "./constants.js";
import * as ui from './ui.js';
import * as wss from './wss.js';

export function sendPreOffer(code, callType) {
  assert.isString(code, 'offer code should be a string');
  assert.oneOf(callType, Object.values(CALL_TYPE));

  console.log('preOffer function run', code, callType);

  const data = {
    callType: callType,
    calleePersonalCode: code,
  };

  wss.sendPreOffer(data);
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
    ui.showCallingDialog(callType, acceptCallHandler, rejectCallHandler);
  }

  console.log('Callee received preOffer', connectedUserDetails);
}

function acceptCallHandler() { 
  console.log('acceptCallHandler()');
}
function rejectCallHandler() {
  console.log('rejectCallHandler()');
}
