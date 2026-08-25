import { useState, useEffect, useRef } from "react";

export default function App() {
  const [lines, setLines] = useState([]);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, interim]);

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (e) => {
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          setLines(prev => [...prev, transcript.trim()]);
          setInterim("");
        } else {
          interimText += transcript;
        }
      }
      setInterim(interimText);
    };

    recognition.onerror = (e) => {
      if (e.error !== "no-speech") {
        setListening(false);
      }
    };

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (recognitionRef.current) {
        recognition.start();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    setInterim("");
  }

  function clearAll() {
    setLines([]);
    setInterim("");
  }

  return (
    <div style={{
      background: "#0a0a0f",
      minHeight: "100vh",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      color: "#e8e8f2",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(to bottom, #0a0a0f 60%, transparent)",
        zIndex: 10,
      }}>
        <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.3px" }}>Echo</span>
        <div style={{ display: "flex", gap: 10 }}>
          {lines.length > 0 && (
            <button onClick={clearAll} style={btnStyle("#1c1c26", "#6b6b85")}>
              Clear
            </button>
          )}
          {supported ? (
            <button
              onClick={listening ? stopListening : startListening}
              style={btnStyle(listening ? "#c62828" : "#2563eb", "#fff")}
            >
              {listening ? "Stop" : "Start"}
            </button>
          ) : (
            <span style={{ fontSize: 13, color: "#f87171" }}>Not supported in this browser</span>
          )}
        </div>
      </div>

      {/* Transcript */}
      <div style={{
        flex: 1,
        padding: "100px 28px 120px",
        maxWidth: 800,
        margin: "0 auto",
        width: "100%",
      }}>
        {lines.length === 0 && !interim && !listening && (
          <div style={{
            position: "fixed",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#333345",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎙️</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Press Start to begin captioning</div>
            <div style={{ fontSize: 13, marginTop: 8, color: "#252535" }}>Works best in Chrome</div>
          </div>
        )}

        {lines.map((line, i) => {
          // Fade out older lines
          const fromEnd = lines.length - 1 - i;
          const opacity = fromEnd > 12 ? 0 : fromEnd > 6 ? 0.3 + ((12 - fromEnd) / 6) * 0.4 : 1;
          return (
            <p key={i} style={{
              fontSize: 22,
              lineHeight: 1.6,
              marginBottom: 8,
              opacity,
              transition: "opacity 0.5s ease",
              color: "#e8e8f2",
            }}>
              {line}
            </p>
          );
        })}

        {interim && (
          <p style={{
            fontSize: 22,
            lineHeight: 1.6,
            marginBottom: 8,
            color: "#6b6b85",
            fontStyle: "italic",
          }}>
            {interim}
          </p>
        )}

        {listening && !interim && lines.length === 0 && (
          <p style={{ color: "#333345", fontSize: 18, fontStyle: "italic" }}>
            Listening…
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Bottom fade */}
      <div style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        height: 100,
        background: "linear-gradient(to top, #0a0a0f 40%, transparent)",
        pointerEvents: "none",
      }} />

      {/* Listening indicator */}
      {listening && (
        <div style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#13131a",
          border: "1px solid #252535",
          borderRadius: 24,
          padding: "8px 18px",
          fontSize: 13,
          color: "#6b6b85",
        }}>
          <div style={{
            width: 8, height: 8,
            borderRadius: "50%",
            background: "#f87171",
            animation: "pulse 1.5s infinite",
          }} />
          Live
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

function btnStyle(bg, color) {
  return {
    background: bg,
    color,
    border: "none",
    borderRadius: 20,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  };
}