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

export enum PRE_OFFER_ANSWER {
  CALLEE_NOT_FOUND = 'CALLEE_NOT_FOUND',
  CALL_ACCEPTED = 'CALL_ACCEPTED',
  CALL_REJECTED = 'CALL_REJECTED',
  CALLEE_UNAVAILABLE = 'CALL_UNAVAILABLE',
};
