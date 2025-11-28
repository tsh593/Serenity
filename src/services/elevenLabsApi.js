// Hugging Face Text-to-Speech Service
const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const HF_TTS_MODEL = "facebook/mms-tts-eng"; // English TTS model

export const generateSpeech = async (text) => {
  if (!HF_API_KEY || HF_API_KEY === 'your_huggingface_api_key_here') {
    throw new Error('Hugging Face API key not configured');
  }

  try {
    console.log('Generating speech with Hugging Face TTS...');
    
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_TTS_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face TTS error:', errorText);
      
      // If model is loading, try after delay
      if (response.status === 503) {
        const data = JSON.parse(errorText);
        if (data.error && data.estimated_time) {
          console.log(`Model loading, waiting ${data.estimated_time} seconds...`);
          // You could implement retry logic here
        }
      }
      
      throw new Error(`Hugging Face TTS error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    console.log('Speech generated successfully');
    return audioUrl;

  } catch (error) {
    console.error('Error calling Hugging Face TTS:', error);
    throw error;
  }
};

export const playAudio = (audioUrl) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.onended = resolve;
    audio.onerror = reject;
    audio.play().catch(reject);
  });
};

// Alternative TTS models you can try:
export const TTS_MODELS = {
  MMS_ENGLISH: "facebook/mms-tts-eng",
  MMS_SPANISH: "facebook/mms-tts-spa", 
  SPEECHT5: "microsoft/speecht5_tts",
  COQUI_ENGLISH: "coqui/XTTS-v1"
};