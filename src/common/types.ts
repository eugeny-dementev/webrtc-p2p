import { CALL_TYPE, PRE_OFFER_ANSWER } from "./constants";

export interface FrontToBack {
  from: 'front',
  to: 'back',
}

export interface BackToFront {
  from: 'back',
  to: 'front',
}

export interface PreOfferFromCaller extends FrontToBack {
  callType: CALL_TYPE,
  calleePersonalCode: string,
}
// caller(PreOfferFromCaller) => back(PreOfferFromCaller->PreOfferForCallee) => callee(PreOfferForCallee)
export interface PreOfferForCallee extends BackToFront {
  callType: CALL_TYPE,
  callerSocketId: string,
}


export interface PreAnswerFromCallee extends FrontToBack {
  preOfferAnswer: PRE_OFFER_ANSWER,
  callerSocketId: string,
}
// callee(PreAnswerFromCallee) => back(PreAnswerFromCallee->PreAnswerForCaller) => caller(PreAnswerForCaller)
export interface PreAnswerForCaller extends BackToFront {
  preOfferAnswer: PRE_OFFER_ANSWER,
  callerSocketId: string,
}

