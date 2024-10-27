import { Container } from "inversify";
import { SocketClient } from "./SocketClient";
import { Store } from "./store";
import { TOKEN } from "./tokens";
import { UI } from "./ui";
import { WebRTCApp } from "./WebRTCApp";

export const container = new Container();

container
  .bind<Store>(TOKEN.Store)
  .to(Store)
  .inSingletonScope();

container
  .bind<UI>(TOKEN.UI)
  .to(UI)
  .inSingletonScope();

container
  .bind<SocketClient>(TOKEN.SocketClient)
  .to(SocketClient)
  .inSingletonScope();

container
  .bind<WebRTCApp>(TOKEN.WebRTCApp)
  .to(WebRTCApp)
  .inSingletonScope();
