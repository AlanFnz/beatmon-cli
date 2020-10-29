/* global Mp3LameEncoder */
import './Mp3LameEncoder';
import { serializeAudioBuffer } from './audio-helper'

function encodeAudioBufferLame ({channels, sampleRate}) {
  console.log(channels)
  // new an encoder: bitRate = 192
  const encoder = new Mp3LameEncoder(sampleRate, 192);
  // Mp3LameEncoder.Mp3LameEncoderConfig = { TOTAL_MEMORY: 1073741824 };
  encoder.encode(channels)

  const blob = encoder.finish()
  console.log(blob)
  return blob
}

const encode = async (audioBuffer) => {
  const audioData = serializeAudioBuffer(audioBuffer);

  const blob = await encodeAudioBufferLame(audioData);

  return blob;
};

export default encode;