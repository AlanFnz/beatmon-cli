import { serializeAudioBuffer } from './audio-helper' 
import workerScript from 'worker-loader!../audio.worker'; // eslint-disable-line import/no-webpack-loader-syntax

// console.log(worker);
// export const worker = new Worker(workerScript);
// console.log(worker);
import * as Comlink from 'comlink';


/**
 * use worker to encode audio
 * @param {AudioBuffer} audioBuffer
 * @param {string} type
 * @return {Promise<Blob>}
 */

export const encode = async (audioBuffer, type) => {
  const worker = new Worker(workerScript);
  
  const id = Math.random()

  const audioData = serializeAudioBuffer(audioBuffer)
    
  const encodeExpose = Comlink.wrap(worker);
  
  const encodedAudio = await encodeExpose({type, audioData, id});

  return encodedAudio;
};
