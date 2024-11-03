import { inject, injectable } from "inversify";
import { CALL_TYPE } from "../common/constants";
import { CallerSignaling } from "./CallerSignaling";
import { Store } from "./store";
import { TOKEN } from "./tokens";

const defaultConfiguration: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:13902',
    },
  ],
}

@injectable()
export class CallerPeer {
  private connection: RTCPeerConnection;

  constructor(
    @inject(TOKEN.CallerSignaling) private readonly callerSignaling: CallerSignaling,
    @inject(TOKEN.Store) private readonly store: Store,
  ) {
    this.ontrack = this.ontrack.bind(this);
    this.onicecandidate = this.onicecandidate.bind(this);
    this.onconnectionstatechange = this.onconnectionstatechange.bind(this);
  }

  init() {
    this.connection = new RTCPeerConnection(defaultConfiguration);

    // prepare remote media stream to receive remote media tracks
    this.store.remoteStream = new MediaStream();

    this.connection.onicecandidate = this.onicecandidate;
    this.connection.onconnectionstatechange = this.onconnectionstatechange;
    this.connection.ontrack = this.ontrack;

    if (this.store.callType === CALL_TYPE.PersonalCall) {
      this.addTracks();
    }
  }

  private addTracks() {
    for (const mediaTrack of this.store.localStream.getTracks()) {
      this.connection.addTrack(mediaTrack);
    }
  }

  private onicecandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      this
        .callerSignaling
        .emitIceCandidateToCallee(event.candidate, this.store.callerSocketId)
    }
  }

  private onconnectionstatechange() {
    if (this.connection.connectionState === 'connected') {
      console.log('Successfully connected to callee peer');
    }
  }

  private ontrack(event: MediaStreamTrackEvent) {
    this.store.remoteStream.addTrack(event.track);
  }
}
