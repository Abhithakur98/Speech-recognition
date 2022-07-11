import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";

const VoiceEmotionRecogniton = () => {

  const [model, setModel] = useState<tf.LayersModel | null>(null);

  useEffect(() => {
    loadAudio();
    loadModel();
  }, []);

  const loadAudio = () => {
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
    .then((audioStream) => {
    })
    .catch((err) => console.log("Log: Error while getting audio stream: ", err));
  };

  const loadModel = () => {
    tf.loadLayersModel("/converted_models/emotion_voice_recognition/model.json")
    .then((layersModel) => {
      setModel(layersModel);
      console.log("Log: Model loaded: ", layersModel);
    })
    .catch((err) => console.log("Log: Error while loading model: ", err));
  };

  return (
    <></>
  );

};

export default VoiceEmotionRecogniton;