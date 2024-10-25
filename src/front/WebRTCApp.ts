import { injectable } from 'inversify';
import { CALL_TYPE } from '../common/constants';
import { event } from '../common/helpers';
import { CalleePreOffer } from '../common/types';
import * as store from './store';
import * as ui from './ui';
import * as webRTCHandler from './webRTCHandler';
import * as wss from './wss';

@injectable()
export class WebRTCApp {
  constructor() { }

  start() {
    wss.subscribeToSocketEvent('connect', () => {
      console.log('success connection to socket.io server with id:', wss.socket.id);
      store.setSocketId(wss.socket.id);
      ui.updatePersonalCode(wss.socket.id);
    });
    wss.subscribeToSocketEvent(event('pre-offer').from('back').to('front'), (data: CalleePreOffer) => {
      webRTCHandler.handlePreOffer(data)
    });
    wss.subscribeToSocketEvent(event('pre-offer-answer').from('back').to('front'), (data) => {
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
}
