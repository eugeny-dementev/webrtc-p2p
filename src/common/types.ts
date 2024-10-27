import { CALL_TYPE, PRE_OFFER_ANSWER } from "./constants";

export interface PreOfferFromCaller {
  callType: CALL_TYPE,
  calleePersonalCode: string,
  from: 'front',
  to: 'back',
}
// caller(PreOfferFromCaller) => back(PreOfferFromCaller->PreOfferForCallee) => callee(PreOfferForCallee)
export interface PreOfferForCallee {
  callType: CALL_TYPE,
  callerSocketId: string,
  from: 'back',
  to: 'front',
}


export interface PreAnswerFromCallee {
  preOfferAnswer: PRE_OFFER_ANSWER,
  callerSocketId: string,
  from: 'front',
  to: 'back',
}
// callee(PreAnswerFromCallee) => back(PreAnswerFromCallee->PreAnswerForCaller) => caller(PreAnswerForCaller)
export interface PreAnswerForCaller {
  preOfferAnswer: PRE_OFFER_ANSWER,
  callerSocketId: string,
  from: 'back',
  to: 'front',
}

