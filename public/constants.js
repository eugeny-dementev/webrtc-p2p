export const CALL_TYPE = {
  PersonalCall: 'personal_call',
  PersonalChat: 'personal_chat',
};

export const CALL_INFO = {
  Chat: 'chat',
  Video: 'video',
};

export const CALL_TYPE_TO_INFO = {
  [CALL_TYPE.PersonalCall]: CALL_INFO.Video,
  [CALL_TYPE.PersonalChat]: CALL_INFO.Chat,
}
