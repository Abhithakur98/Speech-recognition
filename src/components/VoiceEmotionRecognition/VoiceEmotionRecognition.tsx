import * as tf from "@tensorflow/tfjs";
import * as SpeechCommand from "@tensorflow-models/speech-commands";
import * as spectrogram from "spectrogram";
import { useEffect, useRef, useState } from "react";
import { Tensor } from "@tensorflow/tfjs";

const VoiceEmotionRecogniton = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [spectro, setSpectro] = useState<spectrogram | null>(null);

  useEffect(() => {
    // loadAudio();
    loadModel();

    // setSpectro(spectrogram(canvasRef.current!, {
    //   audio: {enable: true},
    //   canvas: {
    //     width: 640,
    //     height: 480
    //   }
    // }));

  }, []);

  // useEffect(() => {
  //   someFunc();
  // }, []);

  const someFunc = async () => {
    const mic = await tf.data.microphone({
      fftSize: 1024,
      columnTruncateLength: 232,
      numFramesPerSpectrogram: 43,
      // sampleRateHz:48000,
      includeSpectrogram: true,
      includeWaveform: true
    });
    mic.start();
    setTimeout(async () => {
      // (await mic.toArray()).forEach((tensor) => {
      //   tensor.print();
      // });
      const x = await mic.next();
      if (x) {
        console.log(x.value);
        const spectrogram: Tensor = x.value.spectrogram;
        console.log(model?.predict(spectrogram).toString(true));
      }
      mic.stop();
      // const spectrogramTensor = audioData[0].spectrogram;
      // spectrogramTensor.print();
      // const waveformTensor = audioData.waveform;
      // waveformTensor.print();
    }, 3000);
  };

  const loadAudio = () => {
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
    .then((audioStream) => {
      // const audioCtx = new window.AudioContext();
      // const audioBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate*3, audioCtx.sampleRate);
      // // audioBuffer.copyFromChannel(audioStream.getAudioTracks()[0], 1, 0.5);
      // new Float32Array(audioStream.getAudioTracks()[0]);

      
    })
    .catch((err) => console.log("Log: Error while getting audio stream: ", err));
  };

  const loadModel = () => {
    tf.loadLayersModel("/converted_models/emotion_voice_recognition/model.json")
    .then(async (layersModel) => {
      setModel(layersModel);
      console.log("Log: Model loaded: ", layersModel);
      const mic = await tf.data.microphone({
        fftSize: 1024,
        columnTruncateLength: 216,
        numFramesPerSpectrogram: 1,
        // sampleRateHz:48000,
        includeSpectrogram: true,
        includeWaveform: true
      });
      mic.start();
      setTimeout(async () => {
        // (await mic.toArray()).forEach((tensor) => {
        //   tensor.print();
        // });
        const x = await mic.next();
        if (x) {
          console.log(x.value);
          const spectrogram: Tensor = x.value.spectrogram;
          const predictions = layersModel.predict(spectrogram, {batchSize: 32, verbose: true}) as tf.Tensor;
          const predictions1 = predictions.argMax(1);
          const abc = predictions1.flatten();
          console.log("Emotion:", (predictions1.arraySync() as number[])[0]);
          // console.log((predictions.arraySync() as number[][])[0]);
        }
        mic.stop();
        // const spectrogramTensor = audioData[0].spectrogram;
        // spectrogramTensor.print();
        // const waveformTensor = audioData.waveform;
        // waveformTensor.print();
      }, 3000);
    })
    .catch((err) => console.log("Log: Error while loading model: ", err));
  };

  return (
    <canvas ref={canvasRef}></canvas>
  );

};

export default VoiceEmotionRecogniton;




// const audioCtx = new window.AudioContext();
      // const javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
      // javascriptNode.connect(audioCtx.destination);
      // const analyser = audioCtx.createAnalyser();
      // analyser.smoothingTimeConstant = 0;
      // analyser.fftSize = 1024;
      // analyser.connect(javascriptNode);
      // const source = audioCtx.createBufferSource();
      // source.connect(analyser);
      // source.connect(audioCtx.destination);

      // const audioContext = new AudioContext();
      // const input = audioContext.createMediaStreamSource(audioStream);
      // const analyser = audioContext.createAnalyser();
      // analyser.smoothingTimeConstant = 0;
      // analyser.fftSize = 2048;
      // input.connect(analyser);
      // if (spectro !== null) {
      //   spectro!.connectSource(analyser, audioContext);
      //   spectro!.start();
      // }

      // const recognizer = SpeechCommand.create("BROWSER_FFT");
      // Promise.all([
      //   recognizer.ensureModelLoaded()
      // ])
      // .then(() => {
      //   recognizer.listen(async ({spectrogram}) => {
      //     console.log("Log: Spectrogram: ", spectrogram);
      //   }, {includeSpectrogram: true, probabilityThreshold: 0.7});
      // })
      // .catch((err) => console.log("Log: Error while loading Speech Command model: ", err));