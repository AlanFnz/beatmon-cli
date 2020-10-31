import audioEncoder from 'audio-encoder';
import resampler from 'audio-resampler'; 

const conversor = async (audioBuffer) => {
  return new Promise((resolve, reject) => {
    // Resampling (Audio encoder expects 44100)
    resampler(audioBuffer, 44100, function(event) {
      const resampled = event.getAudioBuffer();
      // Encoding to mp3
      audioEncoder(resampled, 128, null, function(blob) {
        resolve(blob);
      });
    })  
  })
};

export default conversor
