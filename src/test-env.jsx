import React from 'react'

const TestEnv = () => {
  console.log('Gemini Key exists:', !!import.meta.env.VITE_GEMINI_API_KEY)
  console.log('ElevenLabs Key exists:', !!import.meta.env.VITE_ELEVENLABS_API_KEY)
  
  return (
    <div style={{ padding: '20px', background: 'red', color: 'white' }}>
      <h3>Environment Variables Test:</h3>
      <p>Gemini Key Loaded: {import.meta.env.VITE_GEMINI_API_KEY ? 'YES' : 'NO'}</p>
      <p>ElevenLabs Key Loaded: {import.meta.env.VITE_ELEVENLABS_API_KEY ? 'YES' : 'NO'}</p>
    </div>
  )
}

export default TestEnv