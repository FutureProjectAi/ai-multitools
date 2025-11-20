// pages/api/tts.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }

  // Cek dulu ENV-nya ada atau tidak
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing");
    return res.status(500).json({ error: "Server: API key missing" });
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",            // model TTS OpenAI :contentReference[oaicite:0]{index=0}
      voice: "alloy",
      input: text,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);
    res.status(200).send(buffer);
  } catch (err) {
    console.error("TTS OpenAI error:", err?.response?.data || err.message);
    res.status(500).json({
      error: "OpenAI error",
      detail: err?.response?.data || err.message || "Unknown error",
    });
  }
}
