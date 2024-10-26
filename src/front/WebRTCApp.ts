import { inject, injectable } from 'inversify';
import { assert } from '../common/assert';
import { CALL_TYPE } from '../common/constants';
import { event } from '../common/helpers';
import { CalleePreOffer } from '../common/types';
import { Store } from './store';
import { TOKEN } from './tokens';
import { UI } from './ui';
import * as webRTCHandler from './webRTCHandler';
import * as wss from './wss';

@injectable()
export class WebRTCApp {
  constructor(
    @inject(TOKEN.Store) private readonly store: Store,
    @inject(TOKEN.UI) private readonly ui: UI,
  ) { }

  start() {
    wss.subscribeToSocketEvent('connect', () => {
      console.log('success connection to socket.io server with id:', wss.socket.id);
      this.store.socketId = wss.socket.id;
      this.ui.updatePersonalCode();
    });
    wss.subscribeToSocketEvent(event('pre-offer').from('back').to('front'), (data: CalleePreOffer) => {
      webRTCHandler.handlePreOffer(data)
    });
    wss.subscribeToSocketEvent(event('pre-offer-answer').from('back').to('front'), (data) => {
      webRTCHandler.handlePreOfferAnswer(data);
    });

    this.ui.registerButtonHandler('personal_code_copy_button', () => {
      const code = this.store.socketId;
      assert.isString(code, 'copied code should be a string');

      if (document.hasFocus()) {
        navigator.clipboard && navigator.clipboard.writeText(code);
      }
    })

    this.ui.registerButtonHandler('personal_code_chat_button', () => {
      const code = this.ui.getInputValue('personal_code_input')

      webRTCHandler.sendPreOffer(code, CALL_TYPE.PersonalChat);
    })

    this.ui.registerButtonHandler('personal_code_video_button', () => {
      const code = this.ui.getInputValue('personal_code_input')

      webRTCHandler.sendPreOffer(code, CALL_TYPE.PersonalCall);
    });
  }
}
