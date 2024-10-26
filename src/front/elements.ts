import { assert } from "../common/assert";

export class Dialog {
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
