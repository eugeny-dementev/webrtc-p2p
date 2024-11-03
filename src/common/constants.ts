import { BackToFront, FrontToBack } from "./types"
import { event } from "./helpers";

export enum CALL_TYPE {
  PersonalCall = 'personal_call',
  PersonalChat = 'personal_chat',
};

export enum CALL_INFO {
  Chat = 'Chat',
  Video = 'Video',
};

export const CALL_TYPE_TO_INFO: Record<CALL_TYPE, CALL_INFO> = {
  [CALL_TYPE.PersonalCall]: CALL_INFO.Video,
  [CALL_TYPE.PersonalChat]: CALL_INFO.Chat,
}

export enum PreOfferAnswer {
  CalleeNotFound = 'CALLEE_NOT_FOUND',
  CallAccepted = 'CALL_ACCEPTED',
  CallRejected = 'CALL_REJECTED',
  CalleeUnavailable = 'CALL_UNAVAILABLE',
};

export const frontToBack: FrontToBack = {
  from: 'front',
  to: 'back'
}

export const backToFront: BackToFront = {
  from: 'back',
  to: 'front'
}

export const SIGNALING_EVENT = {
  PRE_OFFER_FROM_CALLER: event('pre-offer').from('front').to('back'),
  PRE_OFFER_FOR_CALLEE: event('pre-offer').from('back').to('front'),

  PRE_ANSWER_FROM_CALLEE: event('pre-offer-answer').from('front').to('back'),
  PRE_ANSWER_FOR_CALLER: event('pre-offer-answer').from('back').to('front'),

  ICE_CANDIDATE_FROM_CALLER: event('ice-candidate').from('front').to('back'),
  ICE_CANDIDATE_FOR_CALLEE: event('ice-candidate').from('back').to('front'),
};
