import { injectable } from "inversify";
import { assert } from "../common/assert";
import { CALL_INFO } from "../common/constants";

class Dialog {
  private dialog: HTMLDivElement;
  private content: HTMLDivElement;
  private title: HTMLSpanElement;
  private buttonsContainer?: HTMLDivElement;

  constructor() {
    this.buildDialog();
    this.buildContent();
    this.buildTitle();
    this.buildImage();
  }

  private buildDialog() {
    this.dialog = document.createElement('div');
    this.dialog.classList.add('dialog_wrapper');
  }

  private buildContent() {
    this.content = document.createElement('div');
    this.content.classList.add('dialog_content');

    this.dialog.appendChild(this.content);
  }

  private buildTitle() {
    this.title = document.createElement('p');
    this.title.classList.add('dialog_title');

    this.content.appendChild(this.title);
  }

  private buildImage() {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('dialog_image_container');
    const image = document.createElement('img');
    image.classList.add('dialog_image');
    const avatarImagePath = './utils/images/dialogAvatar.png';
    image.src = avatarImagePath;

    imageContainer.appendChild(image);

    this.content.appendChild(imageContainer);
  }

  setTitle(title: string) {
    this.title.innerHTML = title;

    return this;
  }

  addButton(type: 'accept' | 'reject', listener: HTMLButtonElement['onclick']) {
    if (!this.buttonsContainer) {
      this.buttonsContainer = document.createElement('div');
      this.buttonsContainer.classList.add('dialog_button_container');
    }

    const button = document.createElement('button');
    button.classList.add(`dialog_${type}_call_button`);
    const callImage = document.createElement('img');
    callImage.classList.add('dialog_button_image');
    const imagePath = `./utils/images/${type}Call.png`;
    callImage.src = imagePath;
    button.appendChild(callImage);
    button.addEventListener('click', listener);

    this.buttonsContainer.appendChild(button);

    return this;
  }

  appendButtons() {
    assert.isInstanceOf(this.buttonsContainer, HTMLDivElement, 'buttonsContainer must be created before appending');
    this.content.appendChild(this.buttonsContainer);

    return this;
  }

  setDescription(descriptionStr: string) {
    const description = document.createElement('p');
    description.classList.add('dialog_description');
    description.innerHTML = descriptionStr;

    this.content.appendChild(description);

    return this;
  }

  getElement(): HTMLElement {
    return this.dialog;
  }
}

@injectable()
export class ElementsFactory {

  buildDialogBase(title: string) {

  }

}

export function getIncomingCallDialog(callTypeInfo, acceptCallHandler, rejectCallHandler) {
  assert.oneOf(callTypeInfo, Object.values(CALL_INFO));
  assert.isFunction(acceptCallHandler, 'acceptCallHandler should be a function');
  assert.isFunction(rejectCallHandler, 'rejectCallHandler should be a function');

  const dialog = new Dialog()
    .setTitle(`Incoming ${callTypeInfo} Call`)
    .addButton('accept', acceptCallHandler)
    .addButton('reject', rejectCallHandler)
    .appendButtons()
    .getElement();

  return dialog;
}

export function getCallingDialog(cancelCallHandler) {
  assert.isFunction(cancelCallHandler, 'cancelCallHandler should be a function');

  console.log('elements.js calling');

  const dialog = document.createElement('div');
  dialog.classList.add('dialog_wrapper');

  const dialogContent = document.createElement('div');
  dialogContent.classList.add('dialog_content');

  dialog.appendChild(dialogContent);

  const title = document.createElement('p');
  title.classList.add('dialog_title');
  title.innerHTML = `Calling`;

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('dialog_image_container');
  const image = document.createElement('img');
  image.classList.add('dialog_image');
  const avatarImagePath = './utils/images/dialogAvatar.png';
  image.src = avatarImagePath;

  imageContainer.appendChild(image);

  dialogContent.appendChild(title);
  dialogContent.appendChild(imageContainer);

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('dialog_button_container');

  const hangupButton = document.createElement('button');
  hangupButton.classList.add('dialog_reject_call_button');
  const hangupCallImage = document.createElement('img');
  hangupCallImage.classList.add('dialog_button_image');
  const hangupImagePath = './utils/images/rejectCall.png';
  hangupCallImage.src = hangupImagePath;
  hangupButton.appendChild(hangupCallImage);
  hangupButton.addEventListener('click', cancelCallHandler);

  buttonsContainer.appendChild(hangupButton);

  dialogContent.appendChild(buttonsContainer);

  return dialog;
}

export function getInfoDialog(titleStr, descriptionStr) {
  assert.isString(titleStr, 'Title should be a string');
  assert.isString(descriptionStr, 'Description should be a string');

  console.log('elements.js info dialog');

  const dialog = document.createElement('div');
  dialog.classList.add('dialog_wrapper');

  const dialogContent = document.createElement('div');
  dialogContent.classList.add('dialog_content');

  dialog.appendChild(dialogContent);

  const title = document.createElement('p');
  title.classList.add('dialog_title');
  title.innerHTML = titleStr;

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('dialog_image_container');
  const image = document.createElement('img');
  image.classList.add('dialog_image');
  const avatarImagePath = './utils/images/dialogAvatar.png';
  image.src = avatarImagePath;

  imageContainer.appendChild(image);

  const description = document.createElement('p');
  description.classList.add('dialog_description');
  description.innerHTML = descriptionStr;


  dialogContent.appendChild(title);
  dialogContent.appendChild(imageContainer);
  dialogContent.appendChild(description);

  return dialog;
}
