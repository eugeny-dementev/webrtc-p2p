import { inject, injectable } from "inversify";
import { PreAnswerForCaller } from "../common/types";
import { CallerSignaling } from "./CallerSignaling";
import { TOKEN } from "./tokens";
import { UI } from "./ui";

@injectable()
export class CalleeEventsHandler {
  constructor(
    @inject(TOKEN.CallerSignaling) private readonly caller: CallerSignaling,
    @inject(TOKEN.UI) private readonly ui: UI,
  ) { }

  subscribe() {
    this.caller.subscribeToPreAnswerFromCallee((payload: PreAnswerForCaller) => {
      this.handlePreAnswer(payload);
    })
  }

  handlePreAnswer(payload: PreAnswerForCaller) { }
}

