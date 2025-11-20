import { useState } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState("Halo, ini percobaan text to speech dari proyek AI Multitools.");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAudioUrl("");

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || body.error || "Unknown error");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setError("Error: Gagal generate TTS (OpenAI error)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Text → Speech (TTS)</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          style={{ width: "100%" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? "Generating..." : "Generate TTS"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

      {audioUrl && (
        <div style={{ marginTop: 12 }}>
          <audio src={audioUrl} controls />
          <div>
            <a href={audioUrl} download="tts.mp3">
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
