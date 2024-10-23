import { CALL_TYPE } from './constants';
import * as store from './store';
import * as ui from './ui';
import * as webRTCHandler from './webRTCHandler';
import * as wss from './wss';

export function initialize() {
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
}
