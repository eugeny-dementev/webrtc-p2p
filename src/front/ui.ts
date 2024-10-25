import { CALL_TYPE, CALL_TYPE_TO_INFO, PRE_OFFER_ANSWER } from "../common/constants";
import { assert } from "./assert";
import * as elements from './elements';
import * as store from "./store";

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

    if (document.hasFocus()) {
      navigator.clipboard && navigator.clipboard.writeText(code);
    }
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
  const input = document.getElementById('personal_code_input') as HTMLInputElement;

  console.log('getCalleePersonalCode', input.value);

  return input.value;
}

export function showIncomingCallingDialog(callType, acceptCallHandler, rejectCallHandler) {
  assert.oneOf(callType, Object.values(CALL_TYPE));
  assert.isFunction(acceptCallHandler, 'acceptCallHandler should be a function');
  assert.isFunction(rejectCallHandler, 'rejectCallHandler should be a function');

  const callTypeInfo = CALL_TYPE_TO_INFO[callType];

  const incomingCallDialog = elements.getIncomingCallDialog(callTypeInfo, acceptCallHandler, rejectCallHandler);

  const dialogHTML = document.getElementById('dialog');
  dialogHTML.innerHTML = '';
  dialogHTML.appendChild(incomingCallDialog);
}

export function showCallingDialog(cancelCallHandler) {
  assert.isFunction(cancelCallHandler, 'cancelCallHandler should be a function');

  const callDialog = elements.getCallingDialog(cancelCallHandler);

  const dialogHTML = document.getElementById('dialog');
  dialogHTML.innerHTML = '';
  dialogHTML.appendChild(callDialog);
}

export function removeAllDialogs() {
  const dialogHTML = document.getElementById('dialog');
  dialogHTML.innerHTML = '';
}

export function showInfoDialog(preOfferAnswer) {
  assert.oneOf(preOfferAnswer, Object.values(PRE_OFFER_ANSWER));

  let infoDialog = null;

  switch (preOfferAnswer) {
    case PRE_OFFER_ANSWER.CALL_REJECTED: {
      infoDialog = elements.getInfoDialog(
        'Call rejected',
        'Callee rejected your call',
      );

      break;
    }
    case PRE_OFFER_ANSWER.CALLEE_NOT_FOUND: {
      infoDialog = elements.getInfoDialog(
        'Call not found',
        'Please check provided personal code',
      );

      break;
    }
    case PRE_OFFER_ANSWER.CALLEE_UNAVAILABLE: {
      infoDialog = elements.getInfoDialog(
        'Call is not possible',
        'Probably callee is busy. Please try again later',
      );

      break;
    }
    default: throw new TypeError('Unexpected preOfferAnswer ' + preOfferAnswer);
  }

  if (infoDialog) {
    const dialogHTML = document.getElementById('dialog');
    dialogHTML.innerHTML = '';
    dialogHTML.appendChild(infoDialog);

    setTimeout(() => {
      removeAllDialogs()
    }, 4000);
  }
}

export function showCallElements(callType) {
  assert.oneOf(callType, [CALL_TYPE.PersonalChat, CALL_TYPE.PersonalCall]);

  console.log('showCallElements(callType)', callType);

  if (callType === CALL_TYPE.PersonalChat) {
    showChatCallElements();
  }

  if (callType === CALL_TYPE.PersonalCall) {
    showVideoCallElements();
  }
}

export function showChatCallElements() {
  const chatButtonContainer = document.getElementById('finish_chat_button_container');
  showElement(chatButtonContainer);

  const newMessageInput = document.getElementById('new_message');
  showElement(newMessageInput);

  // block panel until chat is ended
  disableDashboard();
}

export function showVideoCallElements() {
  const callButtons = document.getElementById('call_buttons');
  showElement(callButtons);

  const videoPlaceholder = document.getElementById('videos_placeholder');
  hideElement(videoPlaceholder);

  const remoteVideo = document.getElementById('remote_video');
  showElement(remoteVideo);

  const newMessageInput = document.getElementById('new_message');
  showElement(newMessageInput);

  // block panel until call is ended
  disableDashboard();
}

export function enableDashboard() {
  const dashboardBlocker = document.getElementById('dashboard_blur')

  if (!dashboardBlocker.classList.contains('display_none')) {
    hideElement(dashboardBlocker);
  }
}

export function disableDashboard() {
  const dashboardBlocker = document.getElementById('dashboard_blur')

  if (dashboardBlocker.classList.contains('display_none')) {
    showElement(dashboardBlocker);
  }
}

export function hideElement(element) {
  if (!element.classList.contains('display_none')) {
    element.classList.add('display_none');
  }
}

export function showElement(element) {
  if (element.classList.contains('display_none')) {
    element.classList.remove('display_none');
  }
}
