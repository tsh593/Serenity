// src/services/speechmaticsSttService.js - TEMPORARY FIX
import { createSpeechmaticsJWT } from "@speechmatics/auth";
import { RealtimeClient } from "@speechmatics/real-time-client";

export class SpeechmaticsSTTService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.transcriptCallback = null;
  }

  async initialize(callbacks = {}) {
    try {
      this.transcriptCallback = callbacks.onTranscript;
      
      // TEMPORARY: Hardcode your API key here
      const apiKey = process.env.REACT_APP_SPEECHMATICS_API_KEY || "BRkipDriskiXZpVornAaMEEpVEGXcS1Xvt";
      const endpoint = process.env.REACT_APP_SPEECHMATICS_STT_ENDPOINT || 'wss://eu2.rt.speechmatics.com/v2';
      const language = process.env.REACT_APP_SPEECHMATICS_STT_LANGUAGE || 'en';

      if (!apiKey || apiKey === "YOUR_ACTUAL_API_KEY_HERE") {
        throw new Error('Speechmatics API key not found. Please add your actual API key to this file');
      }

      console.log('🎤 Initializing Speechmatics STT...');

      // Create JWT token
      const jwt = await createSpeechmaticsJWT({
        type: "rt",
        apiKey: apiKey,
        ttl: 300, // 5 minutes
      });

      this.client = new RealtimeClient();
      
      // Set up event handlers
      this.client.addEventListener("receiveMessage", ({ data }) => {
        if (data.message === "AddTranscript") {
          const transcript = this.formatTranscript(data.results);
          if (this.transcriptCallback && transcript) {
            this.transcriptCallback(transcript, 'final');
          }
        } else if (data.message === "AddPartialTranscript") {
          const partialTranscript = this.formatTranscript(data.results);
          if (this.transcriptCallback && partialTranscript) {
            this.transcriptCallback(partialTranscript, 'partial');
          }
        } else if (data.message === "Error") {
          console.error("Speechmatics STT error:", data);
        }
      });

      // Start recognition session
      await this.client.start(jwt, {
        transcription_config: {
          language: language,
          operating_point: "enhanced",
          max_delay: 1.0,
          enable_partials: true,
        },
      });

      this.isConnected = true;
      console.log('✅ Speechmatics STT connected successfully');
      return true;

    } catch (error) {
      console.error('❌ Speechmatics STT initialization failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  // ... rest of the methods remain the same
  formatTranscript(results) {
    if (!results || !Array.isArray(results)) return '';
    
    return results
      .map(result => {
        if (result.alternatives && result.alternatives[0]) {
          return result.alternatives[0].content;
        }
        return '';
      })
      .join(' ')
      .trim();
  }

  // In startRecording method - FIX THE TYPO:
    async startRecording() {
    if (!this.isConnected || !this.client) {
        throw new Error('Speechmatics STT not connected');
    }

    try {
        console.log('🎤 Starting recording...');
        
        // FIX: navigator.mediaDevices (not ediaDevices)
        const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true
        } 
        });

        // Rest of the code remains the same...
        this.audioContext = new AudioContext({ sampleRate: 16000 });
        const source = this.audioContext.createMediaStreamSource(stream);
        const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (event) => {
        if (this.isRecording && this.client) {
            const audioData = event.inputBuffer.getChannelData(0);
            const int16Data = this.convertFloat32ToInt16(audioData);
            this.client.sendAudio(int16Data);
        }
        };

        source.connect(processor);
        processor.connect(this.audioContext.destination);

        this.isRecording = true;
        this.mediaRecorder = stream;
        console.log('✅ Recording started');

    } catch (error) {
        console.error('❌ Failed to start recording:', error);
        throw error;
    }
    }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.getTracks().forEach(track => track.stop());
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.isRecording = false;
    console.log('🛑 Recording stopped');
  }

  convertFloat32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      int16Array[i] = Math.max(-32768, Math.min(32767, float32Array[i] * 32768));
    }
    return int16Array;
  }

  async stop() {
    if (this.isRecording) {
      this.stopRecording();
    }
    
    if (this.client) {
      try {
        await this.client.stopRecognition();
      } catch (error) {
        console.warn('Error stopping Speechmatics:', error);
      }
    }
    
    this.isConnected = false;
  }

  getStatus() {
    return {
      connected: this.isConnected,
      recording: this.isRecording
    };
  }
}

// Singleton instance
export const speechmaticsSTT = new SpeechmaticsSTTService();