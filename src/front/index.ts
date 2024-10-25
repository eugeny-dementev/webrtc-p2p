import "reflect-metadata";
import "./default.css";
import "./styles.css";

import { container } from "./di";
import { WebRTCApp } from "./main";
import { TOKEN } from "./tokens";

const app = container.get<WebRTCApp>(TOKEN.WebRTCApp);

app.start();
