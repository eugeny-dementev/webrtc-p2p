import { Container } from "inversify";
import { WebRTCApp } from "./WebRTCApp";
import { TOKEN } from "./tokens";

export const container = new Container();

container
  .bind<WebRTCApp>(TOKEN.WebRTCApp)
  .to(WebRTCApp)
  .inSingletonScope();
