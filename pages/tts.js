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
      body: JSON.stringify({ text }), // ⬅️ penting
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
