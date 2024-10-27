import { inject, injectable } from "inversify";
import { PreOfferForCallee } from "../common/types";
import { CalleeSignaling } from "./CalleeSignaling";
import { TOKEN } from "./tokens";
import { UI } from "./ui";

@injectable()
export class CalleeEventsHandler {
  constructor(
    @inject(TOKEN.CalleeSignaling) private readonly callee: CalleeSignaling,
    @inject(TOKEN.UI) private readonly ui: UI,
  ) { }

  subscribe() {
    this.callee.subscribeToPreOfferFromCaller((payload: PreOfferForCallee) => {
      this.handlePreOffer(payload);
    })
  }

  handlePreOffer(payload: PreOfferForCallee) { }
}
