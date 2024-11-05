import { inject, injectable } from "inversify";
import { assert } from "../common/assert";
import { CALL_TYPE } from "../common/constants";
import { ILogger } from "../common/Logger";
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
export class Peer {
  private connection: RTCPeerConnection;

  constructor(
    @inject(TOKEN.CallerSignaling) private readonly callerSignaling: CallerSignaling,
    @inject(TOKEN.Store) private readonly store: Store,
    @inject(TOKEN.Logger) private readonly logger: ILogger,
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

  close() {
    this.connection.onicecandidate = undefined;
    this.connection.onconnectionstatechange = undefined;
    this.connection.ontrack = undefined;

    this.connection.close();

    this.connection = undefined;
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.connection.createOffer();
    this.connection.setLocalDescription(offer);

    return offer;
  }

  private addTracks() {
    for (const mediaTrack of this.store.localStream.getTracks()) {
      this.connection.addTrack(mediaTrack);
    }
  }

  private onicecandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      assert.isInstanceOf(event.candidate, RTCIceCandidate, 'event.candidate must be a RTCIceCandidate');

      this
        .callerSignaling
        .emitIceCandidateToCallee(event.candidate, this.store.callerSocketId)
    }
  }

  private onconnectionstatechange() {
    if (this.connection.connectionState === 'connected') {
      this.logger.info('Successfully connected to callee peer', this.connection);
    } else {
      this.logger.debug('Connection state changed', this.connection)
    }
  }

  private ontrack(event: MediaStreamTrackEvent) {
    assert.isInstanceOf(this.store.remoteStream, MediaStream, 'Media stream must exist to add media tracks to it');
    assert.isInstanceOf(event.track, MediaStreamTrack, 'event.track must be a MediaStreamTrack');

    this.store.remoteStream.addTrack(event.track);
  }
}
