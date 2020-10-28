import { SET_PLAYING_SNIPPET, SET_CURRENT_TIME } from '../types';

export const setPlayingSnippet = snippet => (dispatch) => {
  dispatch({ type: SET_PLAYING_SNIPPET, payload: snippet});
}

export const setCurrentTime = currentTime => (dispatch) => {
  dispatch({ type: SET_CURRENT_TIME, payload: currentTime});
};
