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

export const encode = (audioBuffer, type) => {
  const worker = new Worker(workerScript);
  
  const id = Math.random()

  return new Promise((resolve, reject) => {
    const audioData = serializeAudioBuffer(audioBuffer)
    worker.postMessage({
      type,
      audioData,
      id,
    })

    console.log('inside promise');
    console.log(audioData);
    console.log(worker);

    // resolve(audioData.blob);

    /**
     * Worker message event listener
     * @param {MessageEvent} e
     */
    const listener = ({ data }) => {
      console.log(data);
      if (!data || data.id !== id) {
        return
      }
      if (data.error) {
        reject(new Error(data.message))
      } else {
        resolve(data.blob)
      }
      worker.removeEventListener('message', listener)
    }
    
    worker.addEventListener('message', listener)
  })
}

