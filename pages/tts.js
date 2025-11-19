import { useState } from "react";

export default function TTS() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateTTS = async () => {
    setError("");

    if (!text.trim()) {
      setError("Teks masih kosong.");
      return;
    }

    setLoading(true);
    setAudioUrl(null);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }), // ⬅️ penting: kirim { text }
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Gagal generate TTS");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(err.message || "Terjadi error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Text → Speech (TTS)</h1>

      <textarea
        style={{ width: "100%", height: 150, padding: 10 }}
        placeholder="Masukkan teks..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />

      <button
        onClick={generateTTS}
        disabled={loading}
        style={{ marginTop: 10, padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Generating..." : "Generate TTS"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          Error: {error}
        </p>
      )}

      {audioUrl && (
        <div style={{ marginTop: 20 }}>
          <audio controls src={audioUrl} />
        </div>
      )}
    </main>
  );
}
