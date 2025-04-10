import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const TextToSpeech = () => {
    const handleError = (message) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
      });
    };
  
    const handleSuccess = (message) => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message
      });
    }
  const [text, setText] = useState(""); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;
  let utterance = new SpeechSynthesisUtterance();

  useEffect(() => {
    return () => {
      synth.cancel(); 
    };
  }, []);


  const speakText = (textToSpeak) => {
    if (!textToSpeak) return;
    if (!("speechSynthesis" in window)) {
      handleError("Sorry, your browser does not support Text-to-Speech.");
      return;
    }

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
    setIsSpeaking(true);
  };

  
  const readWholePage = () => {
    const pageText = document.body.innerText; 
    speakText(pageText);
  };


  const readSelection = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      speakText(selectedText);
    } else {
      handleError("Please select some text to read.");
    }
  };


  const pauseResumeSpeech = () => {
    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
      } else {
        synth.pause();
      }
    }
  };


  const stopSpeech = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <textarea
        className="w-full p-2 border rounded-lg"
        rows="3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text or select from the page..."
      />
      <div className="flex flex-wrap gap-2 mt-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => speakText(text)}>
          Speak Input
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700" onClick={readWholePage}>
          Read Page
        </button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-700" onClick={readSelection}>
          Read Selection
        </button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700" onClick={pauseResumeSpeech}>
          Pause / Resume
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700" onClick={stopSpeech}>
          Stop
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;