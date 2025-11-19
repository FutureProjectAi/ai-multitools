import { useState } from "react";

export default function TTS() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateTTS = async () => {
    setLoading(true);
    setAudioUrl(null);

    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Text → Speech (TTS)</h1>

      <textarea
        style={{ width: "100%", height: 150, padding: 10 }}
        placeholder="Masukkan teks..."
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={generateTTS}
        disabled={loading}
        style={{ marginTop: 10, padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Loading..." : "Generate TTS"}
      </button>

      {audioUrl && (
        <div style={{ marginTop: 20 }}>
          <audio controls src={audioUrl} />
        </div>
      )}
    </main>
  );
}
