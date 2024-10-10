import * as store from './store.js';
import * as ui from './ui.js';
import * as wss from './wss.js';
import * as webRTCHandler from './webRTCHandler.js';

wss.subscribeToSocketEvent('connect', () => {
  console.log('success connection to socket.io server with id:', wss.socket.id);
  store.setSocketId(wss.socket.id);
  ui.updatePersonalCode(wss.socket.id);
});

ui.registerCopyCodeButtonHandler();

ui.registerPersonalChatButtonHandler(() => {
  webRTCHandler.sendPreOffer();
})

ui.registerPersonalVideoButtonHandler(() => {
  webRTCHandler.sendPreOffer();
});

