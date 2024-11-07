import { injectable } from "inversify";

const defaultConstrains: MediaStreamConstraints = {
  audio: true,
  video: true,
}

@injectable()
export class Devices {
  async getLocalStream(): Promise<MediaStream> {
    return navigator
      .mediaDevices
      .getUserMedia(defaultConstrains);
  }
}
