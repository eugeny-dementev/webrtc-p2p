import "./default.css";
import "./styles.css";
import { init } from "./app";
import { initialize } from './front/main';
import bechhi from "./images/bechhi.jpg";

init({
  className: ".card",
  title: "Beckhi",
  content: bechhi,
});

initialize();
