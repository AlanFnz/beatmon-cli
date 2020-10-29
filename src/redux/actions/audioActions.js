import { SET_PLAYING_SNIPPET, SET_CURRENT_TIME, ENCODING_AUDIO_FILE, SET_ENCODED_FILE } from '../types';
import axios from "../../axios";
import { readBlobURL, download } from '../../audioUtils/utils';
import arrayBufferToAudioBuffer from 'arraybuffer-to-audiobuffer';

export const setPlayingSnippet = snippet => (dispatch) => {
  dispatch({ type: SET_PLAYING_SNIPPET, payload: snippet});
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
      console.log(res);
      // const blob = new Blob(res.data, {type: 'audio/mp3'});
      // const file = new File([blob], 'audio.mp3', {type: 'audio/mp3'});
      // const audioUrl = readBlobURL(blob);

      // const blob = new Blob(res.data, {type: 'audio/mp3'});
      // const url = window.URL.createObjectURL(blob);
      // console.log('MP3 URl: ', url);
      // download(url);

      arrayBufferToAudioBuffer(res.data)
        .then(audioBuffer => {
          console.log(audioBuffer)
        }).catch((err) => console.log(err));

      // console.log(audioUrl);
      // console.log(file);
      // download(audioUrl);

      // dispatch({
      //   type: SET_ENCODED_FILE,
      //   payload: res.data
      // });
    })
    .catch((err) => console.log(err));
}