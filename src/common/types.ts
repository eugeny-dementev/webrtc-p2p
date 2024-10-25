import { CALL_TYPE, PRE_OFFER_ANSWER } from "./constants";

export interface CallerPreOffer {
  callType: CALL_TYPE,
  calleePersonalCode: string,
  from: 'front' | 'back',
  to: 'front' | 'back',
}

export interface CalleePreOffer {
  callType: CALL_TYPE,
  callerSocketId: string,
  from: 'front' | 'back',
  to: 'front' | 'back',
}

export interface CalleePreAnswer {
  preOfferAnswer: PRE_OFFER_ANSWER,
  callerSocketId: string,
  from: 'front' | 'back',
  to: 'front' | 'back',
}

