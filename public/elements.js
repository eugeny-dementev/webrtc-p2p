import { CALL_INFO } from "./constants.js";
import { assert } from "./assert.js";

export function getIncomingCallDialog(callTypeInfo, acceptCallHandler, rejectCallHandler) {
  assert.oneOf(callTypeInfo, Object.values(CALL_INFO));
  assert.isFunction(acceptCallHandler, 'acceptCallHandler should be a function');
  assert.isFunction(rejectCallHandler, 'rejectCallHandler should be a function');

  console.log('elements.js Getting incoming call');

  const dialog = document.createElement('div');
  dialog.classList.add('dialog_wrapper');

  const dialogContent = document.createElement('div');
  dialogContent.classList.add('dialog_content');

  dialog.appendChild(dialogContent);

  const title = document.createElement('p');
  title.classList.add('dialog_title');
  title.innerHTML = `Incoming ${callTypeInfo} Call`;

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

  const acceptButton = document.createElement('button');
  acceptButton.classList.add('dialog_accept_call_button');
  const acceptCallImage = document.createElement('img');
  acceptCallImage.classList.add('dialog_button_image');
  const acceptImagePath = './utils/images/acceptCall.png';
  acceptCallImage.src = acceptImagePath;
  acceptButton.appendChild(acceptCallImage);
  acceptButton.addEventListener('click', acceptCallHandler);

  const rejectButton = document.createElement('button');
  rejectButton.classList.add('dialog_reject_call_button');
  const rejectCallImage = document.createElement('img');
  rejectCallImage.classList.add('dialog_button_image');
  const rejectImagePath = './utils/images/rejectCall.png';
  rejectCallImage.src = rejectImagePath;
  rejectButton.appendChild(rejectCallImage);
  rejectButton.addEventListener('click', rejectCallHandler);

  buttonsContainer.appendChild(acceptButton);
  buttonsContainer.appendChild(rejectButton);

  dialogContent.appendChild(buttonsContainer);

  return dialog;
}
