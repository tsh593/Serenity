// src/services/huggingFaceApi.js
// Hugging Face Inference API for conversational models (fallback)
// Docs: https://huggingface.co/inference-api

const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

export async function generateHFResponse(message, history = []) {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error('Hugging Face API key missing');

  // Format history for DialoGPT (list of previous exchanges)
  const inputs = {
    inputs: {
      past_user_inputs: history.filter(m => m.type === 'user').map(m => m.text),
      generated_responses: history.filter(m => m.type === 'ai').map(m => m.text),
      text: message
    }
  };

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inputs)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  // Response format: { generated_text: "..." }
  return {
    text: data.generated_text || '',
    persona: 'Dr. Elara',
    emotion: 'neutral' // You can add emotion extraction if needed
  };
}
