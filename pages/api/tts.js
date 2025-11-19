// pages/api/tts.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, voice } = req.body || {};
  if (!text || text.trim().length === 0) return res.status(400).json({ error: "Text kosong" });

  // Pastikan environment variable OPENAI_API_KEY sudah diset di Vercel / .env.local
  const API_KEY = process.env.OPENAI_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY belum diset" });

  try {
    // Contoh panggilan ke OpenAI TTS endpoint (sesuaikan dengan API TTS yang kamu punya)
    // Perhatikan: endpoint dan model mungkin berbeda tergantung akun / versi OpenAI yang tersedia.
    const payload = {
      model: "gpt-4o-mini-tts", // ganti kalau perlu
      voice: voice || "alloy",
      input: text
    };

    const r = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ error: `TTS API error: ${txt}` });
    }

    const arrayBuffer = await r.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    return res.status(200).json({ audioBase64: base64 });
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
