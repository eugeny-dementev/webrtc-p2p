import { Container } from "inversify";
import { io, Socket } from "socket.io-client";
import { CalleeEventsHandler } from "./CalleeEventsHandler";
import { CalleeSignaling } from "./CalleeSignaling";
import { CallerEventsHandler } from "./CallerEventsHandler";
import { CallerSignaling } from "./CallerSignaling";
import { Devices } from "./Devices";
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
  .bind<Devices>(TOKEN.Devices)
  .to(Devices)
  .inSingletonScope();

container
  .bind<UI>(TOKEN.UI)
  .to(UI)
  .inSingletonScope();

container
  .bind<Socket>(TOKEN.Socket)
  .toDynamicValue((): Socket => io('http://localhost:3030', {
    transports: ['websocket', 'polling'],
    upgrade: true,
  }))
  .inSingletonScope();

container
  .bind<CallerSignaling>(TOKEN.CallerSignaling)
  .to(CallerSignaling)
  .inSingletonScope();

container
  .bind<CallerEventsHandler>(TOKEN.CallerEventsHandler)
  .to(CallerEventsHandler)
  .inSingletonScope();

container
  .bind<CalleeSignaling>(TOKEN.CalleeSignaling)
  .to(CalleeSignaling)
  .inSingletonScope()

container
  .bind<CalleeEventsHandler>(TOKEN.CalleeEventsHandler)
  .to(CalleeEventsHandler)
  .inSingletonScope();

container
  .bind<WebRTCApp>(TOKEN.WebRTCApp)
  .to(WebRTCApp)
  .inSingletonScope();
