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

  setLocalStream(mediaStream: MediaStream) {
    const localVideo = document.getElementById('local_video') as HTMLVideoElement;

    localVideo.addEventListener('loadedmetadata', () => {
      localVideo.play();
    })

    localVideo.srcObject = mediaStream;
  }

  setRemoteVideo(mediaStream: MediaStream) {
    const remoteVideo = document.getElementById('remote_video') as HTMLVideoElement;


    remoteVideo.addEventListener('loadedmetadata', () => {
      remoteVideo.play();
    })

    remoteVideo.srcObject = mediaStream;
  }

  showCallingDialog(cancel: HTMLElement['onclick']) {
    assert.isFunction(cancel, 'cancelCallHandler should be a function');

    const callDialog = new elements.Dialog()
      .setTitle('Calling')
      .addButton('reject', cancel)
      .appendButtons()
      .getElement();

    const dialogHTML = document.getElementById('dialog');
    dialogHTML.innerHTML = '';
    dialogHTML.appendChild(callDialog);
  }

  showIncomingCallingDialog(callType: CALL_TYPE, accept: () => void, reject: () => void) {
    assert.oneOf(callType, Object.values(CALL_TYPE));

    const callTypeInfo = CALL_TYPE_TO_INFO[callType];

    const incomingCallDialog = new elements.Dialog()
      .setTitle(`Incoming ${callTypeInfo} Call`)
      .addButton('accept', accept)
      .addButton('reject', reject)
      .appendButtons();

    this.showDialog(incomingCallDialog);
  }

  updateMicButton(micEnabled: boolean) {
    const micOnImgSrc = './utils/images/mic.png';
    const micOffImgSrc = './utils/images/micOff.png';

    const micButtonImage = this.get('mic_button_image') as HTMLImageElement;

    micButtonImage.src = micEnabled
      ? micOnImgSrc
      : micOffImgSrc;
  }

  showInfoDialog(preOfferAnswer: PreOfferAnswer) {
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
      this.showDialog(infoDialog);

      setTimeout(() => {
        this.removeDialog()
      }, 4000);
    }
  }

  showCallElements(callType: CALL_TYPE) {
    assert.oneOf(callType, [CALL_TYPE.PersonalChat, CALL_TYPE.PersonalCall]);

    console.log('showCallElements(callType)', callType);

    if (callType === CALL_TYPE.PersonalChat) {
      this.showChatCallElements();
    }

    if (callType === CALL_TYPE.PersonalCall) {
      this.showVideoCallElements();
    }

    this.removeDialog();
  }

  private showChatCallElements() {
    this.show('finish_chat_button_container');
    this.show('new_message');

    // block panel until chat is ended
    this.disableDashboard();
  }

  private showVideoCallElements() {
    assert.isInstanceOf(this.store.remoteStream, MediaStream, 'this.store.remoteStream must exists for video call');

    this.show('call_buttons');
    this.hide('videos_placeholder');

    this.show('remote_video');
    this.setRemoteVideo(this.store.remoteStream);

    this.show('new_message')

    // block panel until call is ended
    this.disableDashboard();
  }

  private showDialog(dialog: elements.Dialog) {
    const dialogHTML = document.getElementById('dialog');
    dialogHTML.innerHTML = '';
    dialogHTML.appendChild(dialog.getElement());
  }

  removeDialog() {
    const dialogHTML = document.getElementById('dialog');
    dialogHTML.innerHTML = '';
  }

  private hide(id: HTMLElement['id']) {
    const element = document.getElementById(id);
    assert.isInstanceOf(element, HTMLElement, `div[#${id}] element must exist`);

    if (!element.classList.contains('display_none')) {
      element.classList.add('display_none');
    }
  }

  private show(id: HTMLElement['id']) {
    const element = document.getElementById(id);
    assert.isInstanceOf(element, HTMLElement, `div[#${id}] element must exist`);

    if (element.classList.contains('display_none')) {
      element.classList.remove('display_none');
    }
  }

  private get(id: HTMLElement['id']): HTMLElement | undefined {
    return document.getElementById(id);
  }

  private enableDashboard() {
    const dashboardBlocker = document.getElementById('dashboard_blur')

    if (!dashboardBlocker.classList.contains('display_none')) {
      this.hide('dashboard_blur');
    }
  }

  disableDashboard() {
    const dashboardBlocker = document.getElementById('dashboard_blur')

    if (dashboardBlocker.classList.contains('display_none')) {
      this.show('dashboard_blur');
    }
  }
}
