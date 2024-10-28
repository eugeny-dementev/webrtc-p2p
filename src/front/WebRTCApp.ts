import { inject, injectable } from 'inversify';
import { Socket } from 'socket.io-client';
import { assert } from '../common/assert';
import { CALL_TYPE } from '../common/constants';
import { PreAnswerForCaller } from '../common/types';
import { CalleeEventsHandler } from './CalleeEventsHandler';
import { CallerEventsHandler } from './CallerEventsHandler';
import { CallerSignaling } from './CallerSignaling';
import { Store } from './store';
import { TOKEN } from './tokens';
import { UI } from './ui';
import * as webRTCHandler from './webRTCHandler';

@injectable()
export class WebRTCApp {
  constructor(
    @inject(TOKEN.Store) private readonly store: Store,
    @inject(TOKEN.Socket) private readonly socket: Socket,
    @inject(TOKEN.CallerSignaling) private readonly callerSignaling: CallerSignaling,
    @inject(TOKEN.CalleeEventsHandler) private readonly calleeHandler: CalleeEventsHandler,
    @inject(TOKEN.CallerEventsHandler) private readonly callerHandler: CallerEventsHandler,
    @inject(TOKEN.UI) private readonly ui: UI,
  ) { }

  async start() {
    this.socket.on('connect', () => {
      console.log('success connection to server using pure Socket with id:', this.socket.id);
      this.store.socketId = this.socket.id;
      this.ui.updatePersonalCode();
    });

    this.calleeHandler.subscribe();
    this.callerHandler.subscribe();

    this.ui.registerButtonHandler('personal_code_copy_button', () => {
      const code = this.store.socketId;
      assert.isString(code, 'copied code should be a string');

      if (document.hasFocus()) {
        navigator.clipboard && navigator.clipboard.writeText(code);
      }
    })

    this.ui.registerButtonHandler('personal_code_chat_button', () => {
      const code = this.ui.getInputValue('personal_code_input')

      this.callerHandler.emitPreOffer(code, CALL_TYPE.PersonalChat);
    })

    this.ui.registerButtonHandler('personal_code_video_button', () => {
      const code = this.ui.getInputValue('personal_code_input')

      this.callerHandler.emitPreOffer(code, CALL_TYPE.PersonalCall);
    });
  }
}
