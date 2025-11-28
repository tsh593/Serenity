import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function getVoices() {
  try {
    console.log('🔍 Fetching voices from Async API...');
    
    const response = await fetch('https://api.async.ai/voices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.ASYNC_API_KEY,
        'version': 'v1'
      },
      body: JSON.stringify({
        limit: 100
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🎯 Available voices:');
    console.log('Total voices:', data.voices.length);
    
    // Show all voices first
    console.log('\n📋 ALL VOICES:');
    data.voices.forEach((voice, index) => {
      console.log(`${index + 1}. ${voice.name || 'Unnamed'}: ${voice.voice_id}`);
      console.log(`   Description: ${voice.description || 'No description'}`);
      console.log(`   Gender: ${voice.gender || 'Unknown'}`);
      console.log(`   Language: ${voice.language || 'Unknown'}`);
      console.log(`   Type: ${voice.voice_type || 'Unknown'}`);
      console.log('---');
    });
    
    // Filter for potential Aria, Dream, Hope voices
    console.log('\n🎯 POTENTIAL ARIA/DREAM/HOPE VOICES:');
    const potentialVoices = data.voices.filter(voice => {
      const name = (voice.name || '').toLowerCase();
      const desc = (voice.description || '').toLowerCase();
      
      return (
        name.includes('aria') || desc.includes('aria') ||
        name.includes('dream') || desc.includes('dream') ||
        name.includes('hope') || desc.includes('hope') ||
        voice.gender === 'Female' ||
        desc.includes('female') ||
        desc.includes('woman') ||
        desc.includes('lady')
      );
    });
    
    if (potentialVoices.length > 0) {
      potentialVoices.forEach((voice, index) => {
        console.log(`🔊 ${voice.name || 'Unnamed'}: ${voice.voice_id}`);
        console.log(`   Description: ${voice.description || 'No description'}`);
        console.log(`   Gender: ${voice.gender || 'Unknown'}`);
        console.log(`   Language: ${voice.language || 'Unknown'}`);
        console.log('---');
      });
    } else {
      console.log('❌ No voices found matching Aria/Dream/Hope criteria');
      console.log('💡 Try looking for female voices in the full list above');
    }
    
  } catch (error) {
    console.error('❌ Error fetching voices:', error.message);
    console.log('💡 Make sure your ASYNC_API_KEY is set in .env file');
  }
}

getVoices();