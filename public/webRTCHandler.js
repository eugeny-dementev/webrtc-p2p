import { assert } from "./assert.js";
import { callType } from "./constants.js";
import * as wss from './wss.js';

export function sendPreOffer(code, type) {
  assert.isString(code, 'offer code should be a string');
  assert.oneOf(type, Object.values(callType));

  console.log('preOffer function run', code, type);

  const data = {
    callType: type,
    calleePersonalCode: code,
  };

  wss.sendPreOffer(data);
}
