/* eslint-disable no-restricted-globals */
// import encodeWav from './encoder/wav'
// import encodeLame from './encoder/lame'
// import lamejs from 'lamejs';
import * as Comlink from 'comlink';

// ORIG 

// const workerScript = () => {
  self.Mp3LameEncoderConfig = {
    memoryInitializerPrefixURL: '../vendor/',
    TOTAL_MEMORY: 1073741824,
  }

  self.importScripts('../vendor/Mp3LameEncoder.min.js')
  /* global Mp3LameEncoder */

  const encodeLame = async ({ channels, sampleRate }) => {
    console.log(channels)
    // new an encoder: bitRate = 192
    const encoder = new Mp3LameEncoder(sampleRate, 192)
    encoder.encode(channels)
  
    const blob = encoder.finish()
    console.log(blob)
    return blob
  };

  // self.onmessage = function (e) {
    const encodeExpose = async (e) => {
      const { id, audioData } = e.data;
      let blob;
      try {
        blob = encodeLame(audioData);
      } catch (err) {
        console.log(err);
      }
      return blob;
    }

Comlink.expose(encodeExpose);

// }

// let code = workercode.toString();
// code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

// const blob = new Blob([code], {type: "application/javascript"});
// const workerScript = URL.createObjectURL(blob);

// export default workerScript;