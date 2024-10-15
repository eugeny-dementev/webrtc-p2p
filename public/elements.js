import { CALL_INFO } from "./constants.js";
import { assert } from "./assert.js";

export function getIncomingCallDialog(callTypeInfo, acceptCallHandler, rejectCallHandler) {
  assert.oneOf(callTypeInfo, Object.values(CALL_INFO));
  assert.isFunction(acceptCallHandler, 'acceptCallHandler should be a function');
  assert.isFunction(rejectCallHandler, 'rejectCallHandler should be a function');

  console.log('elements.js Getting incoming call');
}
