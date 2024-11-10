import { inject, injectable } from "inversify";
import { assert } from "../common/assert";
import { CALL_TYPE } from "../common/constants";
import { CalleeSignaling } from "./CalleeSignaling";
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
    @inject(TOKEN.CalleeSignaling) private readonly calleeSignaling: CalleeSignaling,
    @inject(TOKEN.Store) private readonly store: Store,
  ) {
    this.ontrack = this.ontrack.bind(this);
    this.onicecandidate = this.onicecandidate.bind(this);
    this.onconnectionstatechange = this.onconnectionstatechange.bind(this);
  }

  init() {
    assert.oneOf(this.store.callType, Object.values(CALL_TYPE));

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

  async initScreenSharing() {
    try {
      this.store.screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const senders = this.connection.getSenders();

      const videoTrack = this.store.localStream.getVideoTracks()[0]
      const videoSender = senders.find((sender) => sender.track.kind === videoTrack.kind);

      if (videoSender) {
        videoSender.replaceTrack(this.store.screenSharingStream.getVideoTracks()[0]);
        this.store.screenSharingActive = true;
      }
    } catch (e) {
      console.error('Failed to activate screen sharing');
      console.error(e);
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

  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    this.connection.setRemoteDescription(offer)

    const answer = await this.connection.createAnswer();
    this.connection.setLocalDescription(answer);

    return answer;
  }

  async setAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    return this.connection.setRemoteDescription(answer);
  }

  async addIceCandidate(candidate: RTCIceCandidate) {
    return this.connection.addIceCandidate(candidate);
  }

  private addTracks() {
    for (const mediaTrack of this.store.localStream.getTracks()) {
      console.log('Adding localStream tracks to connection', mediaTrack);
      this.connection.addTrack(mediaTrack);
    }
  }

  private onicecandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      assert.isInstanceOf(event.candidate, RTCIceCandidate, 'event.candidate must be a RTCIceCandidate');

      if (this.store.calleeSocketId) { // Caller side
        assert.is(this.store.callerSocketId, undefined, 'this.store.callerSocketId must not be present if this.store.calleeSocketId is');

        this.callerSignaling.emitIceCandidateToCallee(event.candidate, this.store.calleeSocketId);
      }

      if (this.store.callerSocketId) { // Callee side
        assert.is(this.store.calleeSocketId, undefined, 'this.store.calleeSocketId must not be present if this.store.callerSocketId is');

        this.calleeSignaling.emitIceCandidateToCaller(event.candidate, this.store.callerSocketId);
      }
    }
  }

  private onconnectionstatechange() {
    if (this.connection.connectionState === 'connected') {
      console.log('Successfully connected to callee peer', this.connection);
    } else {
      console.log('Connection state changed', this.connection.connectionState)
    }
  }

  private ontrack(event: MediaStreamTrackEvent) {
    assert.isInstanceOf(this.store.remoteStream, MediaStream, 'Media stream must exist to add media tracks to it');
    assert.isInstanceOf(event.track, MediaStreamTrack, 'event.track must be a MediaStreamTrack');

    console.log('Received MediaStreamTrack', event.track);

    this.store.remoteStream.addTrack(event.track);
  }
}
