import { Socket } from "socket.io-client";
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

export interface OfferFromCaller extends FrontToBack {
  offer: RTCSessionDescriptionInit,
  calleeSocketId: Socket['id'],
}
// caller(OfferFromCaller) => back(OfferFromCaller->OfferForCallee) => callee(OfferForCallee)
export interface OfferForCallee extends BackToFront {
  offer: RTCSessionDescriptionInit,
  callerSocketId: Socket['id'],
}

export interface AnswerFromCallee extends FrontToBack {
  answer: RTCSessionDescriptionInit,
  callerSocketId: Socket['id'],
}
// callee(AnswerFromCallee) => back(AnswerFromCallee->AnswerForCaller) => caller(AnswerForCaller)
export interface AnswerForCaller extends BackToFront {
  answer: RTCSessionDescriptionInit,
  calleeSocketId: Socket['id'],
}
