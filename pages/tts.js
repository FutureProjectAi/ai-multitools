import { useState } from "react";

/**
 * Simple TTS page for Next.js
 * - Memanggil /api/tts (POST { text, voice })
 * - Menerima base64 audio (audio/mp3) dan menampilkan audio player + tombol download
 */

export default function TTS() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [lastBase64, setLastBase64] = useState("");
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    if (!text.trim()) {
      setError("Tolong isi teks terlebih dahulu.");
      return;
    }

    setLoading(true);
    setAudioUrl("");
    setLastBase64("");

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Gagal menghasilkan audio.");
        return;
      }

      if (!data.audioBase64) {
        setError("Server tidak mengembalikan audio.");
        return;
      }

      setLastBase64(data.audioBase64);

      // convert base64 -> blob -> object URL
      const blob = await (await fetch(`data:audio/mp3;base64,${data.audioBase64}`)).blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setLoading(false);
      setError("Terjadi kesalahan: " + err.message);
    }
  }

  function handleDownload() {
    if (!lastBase64) return;
    const a = document.createElement("a");
    a.href = `data:audio/mp3;base64,${lastBase64}`;
    a.download = "tts-output.mp3";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div style={{ maxWidth: 820, margin: "40px auto", fontFamily: "Inter, Arial, sans-serif", padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Text → Speech (TTS)</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        Masukkan teks, pilih suara (voice) lalu klik <b>Generate Audio</b>.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
        <select value={voice} onChange={(e) => setVoice(e.target.value)} style={{ padding: 8 }}>
          <option value="alloy">Alloy (default)</option>
          <option value="verse">Verse (lebih natural)</option>
          <option value="classic">Classic (robotic)</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "8px 14px",
            background: "#0b5cff",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate Audio"}
        </button>

        <button
          onClick={() => { setText(""); setAudioUrl(""); setLastBase64(""); setError(""); }}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd", background: "#fff" }}
        >
          Clear
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Tulis teks di sini..."
        style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #ddd", fontSize: 15 }}
      />

      {error && (
        <div style={{ marginTop: 12, color: "white", background: "#e74c3c", padding: 10, borderRadius: 6 }}>
          {error}
        </div>
      )}

      {audioUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Hasil Audio</h3>
          <audio controls src={audioUrl} style={{ width: "100%" }} />
          <div style={{ marginTop: 10 }}>
            <button
              onClick={handleDownload}
              style={{
                padding: "8px 12px",
                background: "#0b5cff",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                marginRight: 8,
              }}
            >
              Download MP3
            </button>

            <button
              onClick={() => {
                // open in new tab (data url) for manual save
                if (!lastBase64) return;
                const w = window.open();
                w.document.write(
                  `<audio controls autoplay src="data:audio/mp3;base64,${lastBase64}"></audio>`
                );
              }}
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}
            >
              Buka di Tab Baru
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 28, color: "#666", fontSize: 13 }}>
        <b>Catatan:</b> Pastikan kamu sudah menambahkan <code>OPENAI_API_KEY</code> di Environment Variables Vercel (atau file .env.local saat develop).
      </div>
    </div>
  );
}
