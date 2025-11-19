import { useState } from 'react';

export default function TTS() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateTTS = async () => {
    setLoading(true);
    setAudioUrl(null);

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text
      })
    });

    const audioBlob = await response.blob();
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Text → Speech (TTS)</h1>

      <textarea
        style={{ width: '100%', height: 120 }}
        placeholder="Masukkan teks..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={generateTTS}
        style={{ marginTop: 10, padding: '10px 20px' }}
      >
        {loading ? 'Generating...' : 'Convert to Speech'}
      </button>

      {audioUrl && (
        <audio controls style={{ marginTop: 20, width: '100%' }}>
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      )}
    </main>
  );
}
