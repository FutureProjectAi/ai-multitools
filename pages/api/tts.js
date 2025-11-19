export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 🔧 Pastikan body selalu jadi object
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const text = body?.text || "";

    if (!text.trim()) {
      return res.status(400).json({ error: "Teks kosong di server." });
    }

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
      }),
    });

    // Kalau API OpenAI error, kirim pesan jelas
    if (!response.ok) {
      const errText = await response.text();
      return res
        .status(response.status)
        .json({ error: "OpenAI error", details: errText });
    }

    const audio = await response.arrayBuffer();

    if (!audio || audio.byteLength === 0) {
      return res.status(500).json({ error: "Audio kosong dari OpenAI." });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(Buffer.from(audio));
  } catch (error) {
    res.status(500).json({ error: "TTS failed", details: error.message });
  }
}
