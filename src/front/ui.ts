import { inject, injectable } from "inversify";
import { assert } from "../common/assert";
import { CALL_TYPE, CALL_TYPE_TO_INFO, PreOfferAnswer } from "../common/constants";
import * as elements from './elements';
import { Store } from "./store";
import { TOKEN } from "./tokens";

@injectable()
export class UI {
  constructor(@inject(TOKEN.Store) private readonly store: Store) { }

  updatePersonalCode() {
    const personalCodeParagraph = document.getElementById('personal_code_paragraph');
    assert.isInstanceOf(personalCodeParagraph, HTMLElement, 'div.personal_code_paragraph must exist');

    personalCodeParagraph.innerHTML = this.store.socketId;
  }

  registerButtonHandler(id: HTMLElement['id'], listener: HTMLElement['onclick']) {
    assert.isString(id, '"id" should be provided as a string');
    assert.isFalse(id.length === 0, '"id" should be non-empty string');
    const element = document.getElementById(id);
    assert.isInstanceOf(element, HTMLElement, `div[#${id}] element must exist`);

    element.addEventListener('click', listener);
  }

  getInputValue(id: HTMLInputElement['id']): string {
    assert.isString(id, '"id" should be provided as a string');
    assert.isFalse(id.length === 0, '"id" should be non-empty string');
    const input = document.getElementById(id) as HTMLInputElement;
    assert.isInstanceOf(input, HTMLInputElement, `input[#${id}] element must exist`);

    return input.value;
  }

  showDialog(dialog){
  }
}

export function showIncomingCallingDialog(callType, acceptCallHandler, rejectCallHandler) {
  assert.oneOf(callType, Object.values(CALL_TYPE));
  assert.isFunction(acceptCallHandler, 'acceptCallHandler should be a function');
  assert.isFunction(rejectCallHandler, 'rejectCallHandler should be a function');

  const callTypeInfo = CALL_TYPE_TO_INFO[callType];

  const incomingCallDialog = new elements.Dialog()
    .setTitle(`Incoming ${callTypeInfo} Call`)
    .addButton('accept', acceptCallHandler)
    .addButton('reject', rejectCallHandler)
    .appendButtons()
    .getElement();

  const dialogHTML = document.getElementById('dialog');
  dialogHTML.innerHTML = '';
  dialogHTML.appendChild(incomingCallDialog);
}

export function showCallingDialog(cancelCallHandler) {
  assert.isFunction(cancelCallHandler, 'cancelCallHandler should be a function');

  const callDialog = new elements.Dialog()
    .setTitle('Calling')
    .addButton('reject', cancelCallHandler)
    .appendButtons()
    .getElement();

  const dialogHTML = document.getElementById('dialog');
  dialogHTML.innerHTML = '';
  dialogHTML.appendChild(callDialog);
}

export function removeAllDialogs() {
  const dialogHTML = document.getElementById('dialog');
  dialogHTML.innerHTML = '';
}

export function showInfoDialog(preOfferAnswer) {
  assert.oneOf(preOfferAnswer, Object.values(PreOfferAnswer));

  let infoDialog = new elements.Dialog();
  let showDialog = false;

  switch (preOfferAnswer) {
    case PreOfferAnswer.CallRejected: {
      infoDialog
        .setTitle('Call rejected')
        .setDescription('Callee rejected your call')
      showDialog = true

      break;
    }
    case PreOfferAnswer.CalleeNotFound: {
      infoDialog
        .setTitle('Call not found')
        .setDescription('Please check provided personal code')
      showDialog = true

      break;
    }
    case PreOfferAnswer.CalleeUnavailable: {
      infoDialog
        .setTitle('Call is not possible')
        .setDescription('Probably callee is busy. Please try again later')
      showDialog = true

      break;
    }
    default: throw new TypeError('Unexpected preOfferAnswer ' + preOfferAnswer);
  }

  if (showDialog) {
    const dialogHTML = document.getElementById('dialog');
    dialogHTML.innerHTML = '';
    dialogHTML.appendChild(infoDialog.getElement());

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
