// API Configuration File
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// API Endpoints
export const CHAT_BRAIN_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
export const ELEVENLABS_API_URL_PREFIX = "https://api.elevenlabs.io/v1/text-to-speech/";