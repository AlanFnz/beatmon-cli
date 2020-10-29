import { SET_PLAYING_SNIPPET, SET_CURRENT_TIME, ENCODING_AUDIO_FILE, SET_ENCODED_FILE } from '../types';

const initialState = {
  playingSnippet: '',
  currentTime: 0,
  encoding: false,
  encodedFile: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_PLAYING_SNIPPET:
      return {
        ...state,
        playingSnippet: action.payload,
      };
    case SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload,
      };
    case ENCODING_AUDIO_FILE:
      return {
        ...state,
        encoding: true,
      };
    case SET_ENCODED_FILE:
      return {
        ...state,
        encodedFile: action.payload,
        encoding: false,
      }
    default:
      return state;
  }
};