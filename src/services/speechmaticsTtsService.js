import { audioService } from './audioService';

console.log('🔊 TTS Service Loading...');

// Add pausing state management
let isPaused = false;
let pauseResolve = null;
let currentAudioUrl = null;
let currentTtsPromise = null;

export const generateSpeech = async (text, voice = 'sarah') => {
  try {
    console.log('🔊 Generating TTS via local server...');
    console.log('🎙️ Selected voice:', voice);
    
    // If we're paused, wait for resume
    if (isPaused) {
      console.log('⏸️ TTS waiting for resume...');
      await waitForResume();
    }
    
    const response = await fetch('http://localhost:3001/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.substring(0, 1000),
        voice: voice,
      }),
    });

    console.log(`🔍 Server response status: ${response.status}`);
    
    if (response.ok) {
      const audioBlob = await response.blob();
      
      // Create object URL and ensure it's valid
      currentAudioUrl = URL.createObjectURL(audioBlob);
      console.log('✅ TTS audio generated with voice:', voice, 'URL:', currentAudioUrl);
      
      // Use the audio service for playback and wait for completion
      currentTtsPromise = audioService.playAudio(currentAudioUrl);
      await currentTtsPromise;
      
    } else {
      const errorText = await response.text();
      throw new Error(`TTS server error: ${response.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('❌ TTS generation failed:', error);
    throw error;
  } finally {
    // Always clean up the URL, whether successful or not
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      currentAudioUrl = null;
    }
    currentTtsPromise = null;
  }
};

// Export the stop function
export const stopSpeech = () => {
  audioService.stopAudio();
  isPaused = false;
  if (pauseResolve) {
    pauseResolve();
    pauseResolve = null;
  }
  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }
  currentTtsPromise = null;
};

// Pause current speech - ONLY if something is actually playing
export const pauseSpeech = () => {
  if (audioService.isAudioPlaying() && !isPaused && currentTtsPromise) {
    audioService.pauseAudio();
    isPaused = true;
    console.log('⏸️ TTS paused');
    return true;
  }
  console.log('⚠️ Cannot pause - no active TTS playing');
  return false;
};

// Resume paused speech - ONLY if something was actually paused
export const resumeSpeech = () => {
  if (isPaused && currentTtsPromise) {
    audioService.resumeAudio();
    isPaused = false;
    console.log('▶️ TTS resumed');
    if (pauseResolve) {
      pauseResolve();
      pauseResolve = null;
    }
    return true;
  }
  console.log('⚠️ Cannot resume - TTS not paused');
  return false;
};

// Wait for resume if paused
export const waitForResume = () => {
  return new Promise((resolve) => {
    if (!isPaused) {
      resolve();
    } else {
      pauseResolve = resolve;
    }
  });
};

// Check if audio is currently playing
export const isSpeechPlaying = () => {
  return audioService.isAudioPlaying() || isPaused;
};

// Check if speech is paused
export const isSpeechPaused = () => {
  return isPaused;
};

// Check if we have an active TTS session
export const hasActiveTTS = () => {
  return currentTtsPromise !== null;
};

// Utility function to check if TTS is available
export const isTtsAvailable = () => {
  console.log('🔍 TTS Available: YES (using local server)');
  return true;
};

// Function to get TTS status information
export const getTtsStatus = () => {
  return {
    available: true,
    service: 'Speechmatics TTS (Preview)',
    endpoint: 'http://localhost:3001/api/tts',
    voices: ['sarah', 'theo', 'megan', 'jack'],
    isPlaying: audioService.isAudioPlaying(),
    isPaused: isPaused,
    hasActiveSession: currentTtsPromise !== null
  };
};

// Test function to verify TTS connectivity
export const testTtsConnection = async (voice = 'sarah') => {
  try {
    const testText = "Hello, this is a connection test.";
    console.log('🧪 Testing TTS connection with voice:', voice);
    
    await generateSpeech(testText, voice);
    
    return {
      success: true,
      message: `TTS connection test successful with voice: ${voice}`
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'TTS connection test failed'
    };
  }
};