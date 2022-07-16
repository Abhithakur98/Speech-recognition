# Voice Emotion Recognition

This is a working prototype of emotion recognition from voice in browser, with help of TensorflowJS and pretrained Keras models.

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

#### To run on local server
```
git clone https://github.com/Abhithakur98/Speech-recognition.git
cd Speech-recognition/
npm install
npm run dev
```