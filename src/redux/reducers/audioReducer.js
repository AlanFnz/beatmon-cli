import { SET_PLAYING_SNIPPET, SET_CURRENT_TIME } from '../types';

const initialState = {
  playingSnippet: '',
  currentTime: 0,
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
    default:
      return state;
  }
};