import { CALL_TYPE } from './constants.js';
import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as wss from './wss.js';

wss.subscribeToSocketEvent('connect', () => {
  console.log('success connection to socket.io server with id:', wss.socket.id);
  store.setSocketId(wss.socket.id);
  ui.updatePersonalCode(wss.socket.id);
});
wss.subscribeToSocketEvent('pre-offer', (data) => {
  webRTCHandler.handlePreOffer(data)
});
wss.subscribeToSocketEvent('pre-offer-answer', (data) => {
  webRTCHandler.handlePreOfferAnswer(data);
});

ui.registerCopyCodeButtonHandler();

ui.registerPersonalChatButtonHandler(() => {
  const code = ui.getCalleePersonalCode();

  webRTCHandler.sendPreOffer(code, CALL_TYPE.PersonalChat);
})
ui.registerPersonalVideoButtonHandler(() => {
  const code = ui.getCalleePersonalCode();

  webRTCHandler.sendPreOffer(code, CALL_TYPE.PersonalCall);
});
