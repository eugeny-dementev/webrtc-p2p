import { assert } from "./assert.js";
import { CALL_TYPE, CALL_TYPE_TO_INFO } from "./constants.js";
import * as elements from './elements.js';
import * as store from "./store.js";

export function updatePersonalCode(code) {
  assert.isString(code, 'code should be a string');

  const personalCodeParagraph = document.getElementById('personal_code_paragraph');

  personalCodeParagraph.innerHTML = code;
}

export function registerCopyCodeButtonHandler() {
  const personalCodeCopyButton = document.getElementById('personal_code_copy_button');

  personalCodeCopyButton.addEventListener('click', () => {
    const state = store.getState();
    const code = state.socketId;

    assert.isString(code, 'copied code should be a string');

    navigator.clipboard && navigator.clipboard.writeText(code);
  });
}

const personalCodeChatButton = document.getElementById('personal_code_chat_button');
export function registerPersonalChatButtonHandler(listener) {
  personalCodeChatButton.addEventListener('click', listener);
}

const personalCodeVideoButton = document.getElementById('personal_code_video_button');
export function registerPersonalVideoButtonHandler(listener) {
  personalCodeVideoButton.addEventListener('click', listener);
}

export function getCalleePersonalCode() {
  const input = document.getElementById('personal_code_input');

  return input.value;
}

export function showCallingDialog(callType, acceptCallHandler, rejectCallHandler) {
  assert.oneOf(callType, Object.values(CALL_TYPE));
  assert.isFunction(acceptCallHandler, 'acceptCallHandler should be a function');
  assert.isFunction(rejectCallHandler, 'rejectCallHandler should be a function');

  const callTypeInfo = CALL_TYPE_TO_INFO[callType];

  const incomingCallDialog = elements.getIncomingCallDialog(callTypeInfo, acceptCallHandler, rejectCallHandler);

  const dialogHTML = document.getElementById('dialog');
  dialogHTML.innerHTML = '';
  dialogHTML.appendChild(incomingCallDialog);
}
