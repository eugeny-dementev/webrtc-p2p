import "reflect-metadata";
import "./default.css";
import "./styles.css";

import { container } from "./di";
import { TOKEN } from "./tokens";
import { WebRTCApp } from "./WebRTCApp";

const app = container.get<WebRTCApp>(TOKEN.WebRTCApp);

app.start();
