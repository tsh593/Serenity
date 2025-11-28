// src/services/asyncTtsService.js
export const generateSpeech = async (text) => {
  try {
    const apiKey = process.env.REACT_APP_SPEECHMATICS_API_KEY;
    const voice = process.env.REACT_APP_SPEECHMATICS_VOICE || 'amanda';
    const model = process.env.REACT_APP_SPEECHMATICS_MODEL || 'en-gb';

    if (!apiKey) {
      throw new Error('Speechmatics API key not configured');
    }

    console.log('🔊 Generating Speechmatics TTS with voice:', voice);

    // Speechmatics TTS API endpoint
    const response = await fetch(
      `https://rt.speechmatics.com/v1/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          model: model,
          output_format: 'wav',
          encoding: 'linear16',
          sample_rate: 22050,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Speechmatics TTS: Unauthorized - Check your API key');
      } else if (response.status === 429) {
        throw new Error('Speechmatics TTS: Rate limit exceeded');
      } else {
        const errorText = await response.text();
        throw new Error(`Speechmatics TTS error: ${response.status} - ${errorText}`);
      }
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve, reject) => {
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      });
      
      audio.addEventListener('error', (e) => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Audio playback failed'));
      });
      
      audio.play().catch(reject);
    });
    
  } catch (error) {
    console.error('❌ Speechmatics TTS generation failed:', error);
    throw error;
  }
};