import { inject, injectable } from 'inversify';
import { Socket } from 'socket.io-client';
import { assert } from '../common/assert';
import { CALL_TYPE } from '../common/constants';
import { CalleeEventsHandler } from './CalleeEventsHandler';
import { CallerEventsHandler } from './CallerEventsHandler';
import { Devices } from './Devices';
import { Peer } from './Peer';
import { Store } from './store';
import { TOKEN } from './tokens';
import { UI } from './ui';

@injectable()
export class WebRTCApp {
  constructor(
    @inject(TOKEN.Store) private readonly store: Store,
    @inject(TOKEN.Peer) private readonly peer: Peer,
    @inject(TOKEN.Devices) private readonly devices: Devices,
    @inject(TOKEN.Socket) private readonly socket: Socket,
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

      this.store.calleeSocketId = code;

      this.callerHandler.emitPreOffer(code, CALL_TYPE.PersonalChat);
    })

    this.ui.registerButtonHandler('personal_code_video_button', () => {
      const code = this.ui.getInputValue('personal_code_input')

      this.store.calleeSocketId = code;

      this.callerHandler.emitPreOffer(code, CALL_TYPE.PersonalCall);
    });

    this.ui.registerButtonHandler('mic_button', () => {
      const localStream = this.store.localStream;
      const audioTrack = localStream.getAudioTracks()[0]
      const micEnabled = audioTrack.enabled;

      audioTrack.enabled = !micEnabled

      this.ui.updateMicButton(!micEnabled);
    });

    this.ui.registerButtonHandler('camera_button', () => {
      const localStream = this.store.localStream;
      const videoTrack = localStream.getVideoTracks()[0]
      const cameraEnabled = videoTrack.enabled;

      videoTrack.enabled = !cameraEnabled

      this.ui.updateCameraButton(!cameraEnabled);
    });

    this.ui.registerButtonHandler('screen_sharing_button', () => {
      const screenSharingActive = this.store.screenSharingActive;

      if (screenSharingActive) {
        this.peer
          .stopScreenSharing()
          .then(() => {
            this.ui.setLocalStream(this.store.localStream);
          })
          .catch(console.error)
      } else {
        this.peer
          .initScreenSharing()
          .then(() => {
            this.ui.setLocalStream(this.store.screenSharingStream);
          })
          .catch(console.error)
      }
    });

    const mediaStream = await this.devices.getLocalStream();

    this.store.localStream = mediaStream;
    this.ui.setLocalStream(mediaStream);
  }
}
