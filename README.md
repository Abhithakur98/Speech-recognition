# Voice Emotion Recognition

This is a working prototype of emotion recognition from voice in browser, with help of TensorflowJS and pretrained Keras models.

> Keras model is taken from: https://github.com/MiteshPuthran/Speech-Emotion-Analyzer
> Converted model is here: `public/converted_models/`

### Function
As soon it loads, it starts recording audio for 3 seconds, then reports the predicted emotion from the audio.

If we want to record audio again, refresh the page.

#### Possible Outcomes
- Female, Angry
- Female, Calm
- Female, Fearful
- Female, Happy
- Female, Sad
- Male, Angry
- Male, Calm
- Male, Fearful
- Male, Happy
- Male, Sad

#### Useful Articles
- Reza Chu (Medium): https://towardsdatascience.com/speech-emotion-recognition-with-convolution-neural-network-1e6bb7130ce3

#### To run on local server
```
git clone https://github.com/Abhithakur98/Speech-recognition.git
cd Speech-recognition/
npm install
npm run dev
```