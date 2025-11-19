import { useState } from "react";

export default function TTS() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const generateTTS = async () => {
    setLoading(true);
    setAudioUrl(null);
    setErrorMsg("");

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      // Kalau server balas error, tampilkan pesannya
      if (!response.ok) {
        let msg = "Gagal generate TTS.";
        try {
          const data = await response.json();
          if (data?.error) {
            msg = `${msg} (${data.error})`;
          }
          if (data?.details) {
            console.error("Server details:", data.details);
          }
        } catch (e) {
          // kalau bukan JSON, abaikan
        }
        setErrorMsg(msg);
        setLoading(false);
        return;
      }

      // Berhasil: ambil audio
      const blob = await response.blob();

      // Kalau tipe bukan audio, jangan diputar
      if (!blob.type.startsWith("audio")) {
        setErrorMsg("Respon bukan file audio. Coba lagi.");
        setLoading(false);
        return;
      }

      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi error jaringan / server.");
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

      <div style={{ marginTop: 10 }}>
        <button
          onClick={generateTTS}
          disabled={loading || !text.trim()}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {loading ? "Menghasilkan audio..." : "Generate TTS"}
        </button>
      </div>

      {errorMsg && (
        <p style={{ marginTop: 10, color: "red" }}>
          Error: {errorMsg}
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
