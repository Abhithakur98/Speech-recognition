import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { MicrophoneIterator } from "../../../node_modules/@tensorflow/tfjs-data/dist/iterators/microphone_iterator";
import { Microphone } from "../../assets/icons";

const VoiceEmotionRecogniton = () => {

  const [info, setInfo] = useState<string>("Processing audio for 3 seconds ...");

  const Emotions: string[] = [
    "Female, Angry",
    "Female, Calm",
    "Female, Fearful",
    "Female, Happy",
    "Female, Sad",
    "Male, Angry",
    "Male, Calm",
    "Male, Fearful",
    "Male, Happy",
    "Male, Sad"
  ];

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = () => {
    tf.loadLayersModel("/converted_models/emotion_voice_recognition/model.json")
    .then(async (layersModel) => {
      console.log("Log: Model loaded: ", layersModel);
      const mic = await tf.data.microphone({
        fftSize: 1024,
        columnTruncateLength: 216,
        numFramesPerSpectrogram: 1,
        // sampleRateHz:48000,
        includeSpectrogram: true,
        includeWaveform: false
      });
      mic.start();
      setTimeout(async () => {
        const x = await mic.next();
        if (x) {
          console.log(x.value);
          const spectrogram: tf.Tensor = x.value.spectrogram;
          const predictions = layersModel.predict(spectrogram, {batchSize: 32, verbose: true}) as tf.Tensor;
          const predictions1 = predictions.argMax(1);
          setInfo(Emotions[(predictions1.arraySync() as number[])[0]]);
          console.log("Emotion:", Emotions[(predictions1.arraySync() as number[])[0]]);

          // disposing tensors
          spectrogram.dispose();
          predictions.dispose();
          predictions1.dispose();
        }
        mic.stop();
      }, 3000);
    })
    .catch((err) => console.log("Log: Error while loading model: ", err));
  };

  return (
    <div>
      {info}
    </div>
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