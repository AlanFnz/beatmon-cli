import { SET_PLAYING_SNIPPET, SET_CURRENT_TIME, ENCODING_AUDIO_FILE } from '../types';
import axios from "../../axios";
import arrayBufferToAudioBuffer from 'arraybuffer-to-audiobuffer';

export const setPlayingSnippet = snippetId => (dispatch) => {
  dispatch({ type: SET_PLAYING_SNIPPET, payload: snippetId });
}

export const setCurrentTime = currentTime => (dispatch) => {
  dispatch({ type: SET_CURRENT_TIME, payload: currentTime});
};

// Encode Audio File
export const encodeAudioFile = (audioSlicedBuffer) => (dispatch) => {
  dispatch({ type: ENCODING_AUDIO_FILE });
  axios
    .post("/encode", audioSlicedBuffer)
    .then((res) => {
      arrayBufferToAudioBuffer(res.data)
        .then(audioBuffer => {
          console.log(audioBuffer)
        }).catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}