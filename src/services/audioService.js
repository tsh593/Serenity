class AudioService {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.onEndedCallback = null;
    this.onErrorCallback = null;
  }

  async playAudio(url) {
    // Stop any existing audio
    this.stopAudio();

    return new Promise((resolve, reject) => {
      this.audio = new Audio(url);
      this.isPlaying = true;
      this.isPaused = false;

      // Set up event listeners first
      this.audio.onended = () => {
        console.log('🔚 Audio finished playing');
        this.isPlaying = false;
        this.isPaused = false;
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
        resolve();
      };

      this.audio.onerror = (error) => {
        console.error('❌ Audio playback error:', error);
        this.isPlaying = false;
        this.isPaused = false;
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
        reject(new Error(`Audio playback failed: ${error.message}`));
      };

      this.audio.onloadstart = () => {
        console.log('📥 Audio loading started');
      };

      this.audio.oncanplaythrough = () => {
        console.log('✅ Audio can play through');
      };

      // Try to play the audio
      console.log('🔊 Attempting to play audio from:', url.substring(0, 50) + '...');
      
      const playPromise = this.audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('🔊 Audio started playing successfully');
        }).catch(error => {
          console.error('❌ Audio play failed:', error);
          this.isPlaying = false;
          reject(error);
        });
      }
    });
  }

  pauseAudio() {
    if (this.audio && this.isPlaying && !this.isPaused) {
      this.audio.pause();
      this.isPaused = true;
      this.isPlaying = false;
      console.log('⏸️ Audio paused');
    }
  }

  resumeAudio() {
    if (this.audio && this.isPaused) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPaused = false;
          this.isPlaying = true;
          console.log('▶️ Audio resumed');
        }).catch(error => {
          console.error('❌ Audio resume failed:', error);
          this.isPaused = false;
        });
      }
    }
  }

  stopAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      this.isPaused = false;
      console.log('🛑 Audio stopped');
    }
  }

  isAudioPlaying() {
    return this.isPlaying;
  }

  isAudioPaused() {
    return this.isPaused;
  }

  setVolume(volume) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  getCurrentTime() {
    return this.audio ? this.audio.currentTime : 0;
  }

  getDuration() {
    return this.audio ? this.audio.duration : 0;
  }

  seekTo(time) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  setOnEnded(callback) {
    this.onEndedCallback = callback;
  }

  setOnError(callback) {
    this.onErrorCallback = callback;
  }

  cleanup() {
    this.stopAudio();
    this.audio = null;
    this.onEndedCallback = null;
    this.onErrorCallback = null;
  }
}

export const audioService = new AudioService();