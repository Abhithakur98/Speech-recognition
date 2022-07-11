import { useState } from 'react';
import VoiceEmotionRecogniton from './components/VoiceEmotionRecognition';
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <VoiceEmotionRecogniton />        
      </header>
    </div>
  )
}

export default App
