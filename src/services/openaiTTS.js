// OpenAI Text-to-Speech API utility
export const openaiTTS = async (text, voice = 'alloy', model = 'tts-1', format = 'mp3') => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not configured.');
  const url = 'https://api.openai.com/v1/audio/speech';
  const body = {
    model,
    input: text,
    voice,
    response_format: format
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI TTS error: ${response.status} - ${errorText}`);
  }
  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
};
