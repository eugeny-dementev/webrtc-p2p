import { CALL_TYPE, PreOfferAnswer } from "./constants";

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
  preOfferAnswer: PreOfferAnswer,
  callerSocketId: string,
}
// callee(PreAnswerFromCallee) => back(PreAnswerFromCallee->PreAnswerForCaller) => caller(PreAnswerForCaller)
export interface PreAnswerForCaller extends BackToFront {
  preOfferAnswer: PreOfferAnswer,
  callerSocketId: string,
}

