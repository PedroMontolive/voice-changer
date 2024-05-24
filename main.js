import './style.css'
import { setupCounter } from './counter.js'

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');

let audioContext;
let microphone;
let audioProcessor;

startButton.onclick = async () => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  microphone = audioContext.createMediaStreamSource(stream);

  audioProcessor = audioContext.createScriptProcessor(4096, 1, 1);
  microphone.connect(audioProcessor);
  audioProcessor.connect(audioContext.destination);

  audioProcessor.onaudioprocess = (event) => {
    const input = event.inputBuffer.getChannelData(0);
    const output = event.outputBuffer.getChannelData(0);

    //Efeito de modulação de voz voz
    for (let i = 0; i < input.length; i++) {
      output[i] = input[i] * Math.sin(i / 50);
    }
  };
};

stopButton.onclick = () => {
  if (microphone) {
    microphone.disconnect();
  }
  if (audioProcessor) {
    audioProcessor.disconnect();
  }
  if (audioContext) {
    audioContext.close();
  }
};

setupCounter(document.querySelector('#counter'))
