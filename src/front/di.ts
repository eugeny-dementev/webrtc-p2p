import { Container } from "inversify";
import { TOKEN } from "./tokens";
import { WebRTCApp } from "./WebRTCApp";

export const container = new Container();

container
  .bind<WebRTCApp>(TOKEN.WebRTCApp)
  .to(WebRTCApp)
  .inSingletonScope();
