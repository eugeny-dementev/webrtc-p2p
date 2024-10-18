export const CALL_TYPE = {
  PersonalCall: 'personal_call',
  PersonalChat: 'personal_chat',
};

export const CALL_INFO = {
  Chat: 'Chat',
  Video: 'Video',
};

export const CALL_TYPE_TO_INFO = {
  [CALL_TYPE.PersonalCall]: CALL_INFO.Video,
  [CALL_TYPE.PersonalChat]: CALL_INFO.Chat,
}

export const PRE_OFFER_ANSWER = {
  CALLEE_NOT_FOUND: 'CALLEE_NOT_FOUND',
  CALL_ACCEPTED: 'CALL_ACCEPTED',
  CALL_REJECTED: 'CALL_REJECTED',
  CALL_UNAVAILABLE: 'CALL_UNAVAILABLE',
};
