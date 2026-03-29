import React from "react";

export default function VoiceInput({ onResult, lang = "en-IN", label = "🎤" }) {
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => onResult(event.results[0][0].transcript);
    recognition.onerror = (e) => alert(e.error || "Voice input failed");
    recognition.start();
  };

  return (
    <button type="button" className="voice-btn" onClick={startVoice} title="Voice input">
      {label}
    </button>
  );
}
