import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
  //versions without react extension
  /*
  let SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
  let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
  
  SpeechRecognition.onresult = function(event) {
    for(var word in event.results[0].transcript){
      console.log('Word: ' + word);
    }
  }

  return (
    <div>
      <button onClick={SpeechRecognition.start}>Start</button>
      <button onClick={SpeechRecognition.stop}>Stop</button>
    </div>
  );

  */

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const listenContinuously = () => SpeechRecognition.startListening({
    continuous: true
  })

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={listenContinuously}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>      
    </div>
  );
};
export default Dictaphone;