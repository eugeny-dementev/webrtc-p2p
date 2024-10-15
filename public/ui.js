import { assert } from "./assert.js";
import * as store from "./store.js";
import { CALL_TYPE, CALL_TYPE_TO_INFO } from "./constants.js";

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
  const callTypeInfo = CALL_TYPE_TO_INFO[callType];
}
