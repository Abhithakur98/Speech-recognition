import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { MicrophoneIterator } from "../../../node_modules/@tensorflow/tfjs-data/dist/iterators/microphone_iterator";
import { Microphone } from "../../assets/icons";
import { LayersModel } from "@tensorflow/tfjs";

const VoiceEmotionRecogniton = () => {

  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const microphoneIterator = useRef<MicrophoneIterator | null>(null);
  const [microphoneActive, setMicrophoneActive] = useState<boolean>(false);

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
    loadMicrophoneIterator();
  }, []);

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
        const spectrogram: tf.Tensor = x.value.spectrogram;
        console.log(model?.predict(spectrogram).toString(true));
      }
      mic.stop();
    }, 3000);
  };

  const processAudio = async () => {
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
        const spectrogram: tf.Tensor = x.value.spectrogram;
        if (modelLoaded) {
          const predictions = model!.predict(spectrogram, {batchSize: 32, verbose: true}) as tf.Tensor;
          const predictions1 = predictions.argMax(1);
          console.log("Emotion:", Emotions[(predictions1.arraySync() as number[])[0]]);

          predictions.dispose();
          predictions1.dispose();
        }

        // disposing tensors
        spectrogram.dispose();
      }
      mic.stop();
    }, 3000);
  };

  const loadMicrophoneIterator = async () => {
    tf.data.microphone({
      fftSize: 1024,
      columnTruncateLength: 216,
      numFramesPerSpectrogram: 1,
      // sampleRateHz:48000,
      includeSpectrogram: true,
      includeWaveform: true
    })
      .then((iterator) => {
        microphoneIterator.current = iterator;
        console.log("Log: Microphone Iterator loaded.");
      });
  };

  const loadModel = () => {
    tf.loadLayersModel("/converted_models/emotion_voice_recognition/model.json")
    .then(async (layersModel) => {
      setModel(layersModel);
      setModelLoaded(true);
      console.log("Log: Model loaded: ", layersModel);
      // const mic = await tf.data.microphone({
      //   fftSize: 1024,
      //   columnTruncateLength: 216,
      //   numFramesPerSpectrogram: 1,
      //   // sampleRateHz:48000,
      //   includeSpectrogram: true,
      //   includeWaveform: true
      // });
      // mic.start();
      // setTimeout(async () => {
      //   // (await mic.toArray()).forEach((tensor) => {
      //   //   tensor.print();
      //   // });
      //   const x = await mic.next();
      //   if (x) {
      //     console.log(x.value);
      //     const spectrogram: tf.Tensor = x.value.spectrogram;
      //     const predictions = layersModel.predict(spectrogram, {batchSize: 32, verbose: true}) as tf.Tensor;
      //     const predictions1 = predictions.argMax(1);
      //     console.log("Emotion:", Emotions[(predictions1.arraySync() as number[])[0]]);

      //     // disposing tensors
      //     spectrogram.dispose();
      //     predictions.dispose();
      //     predictions1.dispose();
      //   }
      //   mic.stop();
      // }, 3000);
    })
    .catch((err) => console.log("Log: Error while loading model: ", err));
  };

  const startProcessingAudio = () => {
    microphoneIterator.current?.start();
  };

  const stopProcessingAudio = async () => {
    // while (true) {
    //   const x = await microphoneIterator.current?.next();
    //   if (!x?.done) {
    //     const spectrogram: tf.Tensor = (x?.value as any).spectrogram;
    //     const predictions = (model?.predict(spectrogram, {batchSize: 32, verbose: true}) as tf.Tensor).argMax(1);
    //     console.log("Emotion: ", Emotions[(predictions.arraySync() as number[])[0]])
    //   }
    //   else {
    //     break;
    //   }
    // }
    const x = await microphoneIterator.current?.next();
    const spectrogram: tf.Tensor = (x?.value as any).spectrogram;
    const predictions = (model?.predict(spectrogram, {batchSize: 32, verbose: true}) as tf.Tensor).argMax(1);
    console.log("Emotion: ", Emotions[(predictions.arraySync() as number[])[0]]);
    microphoneIterator.current?.stop();
  };

  const handleClick = () => {
    setMicrophoneActive((active) => {
      if (active) {
        stopProcessingAudio();
        return false;
      }
      startProcessingAudio();
      return true;
    });
  };

  return (
    <Microphone width={200} height={200} color={microphoneActive ? "#bb86fc" : "#413d47"} onClick={handleClick} />
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