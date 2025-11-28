// src/services/freesoundService.js - COMPLETE UPDATED VERSION
class FreesoundService {
  constructor() {
    this.audioContext = null;
    this.isInitialized = false;
    this.soundCache = new Map();
    this.isPlaying = false;
    this.activeSources = new Set();
    this.localSoundBase = '/sounds';
    this.currentGender = 'female'; // Default gender
    
    // Gender-specific sound mappings
    this.genderSoundMappings = {
      // FEMALE SOUNDS
      'female': {
        // EMOTIONAL SOUNDS
        'laugh': '/female-laugh-hysterical-comical.wav',
        'chuckle': '/chuckle-female.ogg',
        'sigh': '/sigh_1_female.mp3',
        'gasp': '/shock-gasp-female.mp3',
        'smile': '/girl-giggling-cutely-sound.mp3',
        'cry': '/female-crying-sound.mp3',
        'sob': '/sad-woman-crying-and-sobbing-sound.mp3',
        'weep': '/audio-girl-crying-sound.mp3',
        'giggle': '/giggling-cutely-sound.mp3',
        'snicker': '/laugh-and-giggles-sound.mp3',

        // DEFAULT FEMALE SOUNDS
        'default': '/click-female.mp3'
      },
      
      // MALE SOUNDS  
      'male': {
        // EMOTIONAL SOUNDS
        'laugh': '/man-laughing-free-sound.mp3',
        'chuckle': '/chuckle-man-sound.mp3',
        'sigh': '/male-sigh-sound.mp3',
        'gasp': '/gasp-male-sound.mp3',
        'smile': '/man-giggling-sound.mp3',
        'cry': '/male-crying-sound.mp3',
        'sob': '/male-crying-sound.mp3',
        'weep': '/male-crying-sound.mp3',
        'giggle': '/man-giggling-sound.mp3',
        'snicker': '/chuckle-man-sound.mp3',

        // DEFAULT MALE SOUNDS
        'default': '/click-male.mp3'
      }
    };
    
    // Gender-neutral sounds (same for both genders)
    this.genderNeutralMappings = {
      // ENVIRONMENTAL & ACTION SOUNDS
      'walk': '/footsteps.mp3',
      'walking': '/footsteps.mp3',
      'footsteps': '/footsteps.mp3',
      'run': '/running-footsteps.mp3',
      'running': '/running-footsteps.mp3',
      'pour': '/water-pour.mp3',
      'pouring': '/water-pour.mp3',
      'water': '/water-pour.mp3',
      'coffee': '/espresso-coffee-machine-sound.mp3',
      'coffee machine': '/espresso-coffee-machine-sound.mp3',
      'grind': '/coffee-bean-grinder.wav',
      'grinding': '/coffee-bean-grinder.wav',
      'cabinet': '/cabinet.mp3',
      'cup': '/cup-clink.mp3',
      'cups': '/cup-clink.mp3',
      'door': '/door.mp3',
      'paper': '/paper-flutter.mp3',
      'write': '/vintage-writing-sounds.mp3',
      'writing': '/vintage-writing-sounds.mp3',
      'scribble': '/pencil-writingscribble-sound.mp3',
      'scribbling': '/pencil-writingscribble-sound.mp3',
      'type': '/keyboard-typing.mp3',
      'typing': '/keyboard-typing.mp3',
      'phone': '/phone-ringing.mp3',
      'ring': '/phone-ringing.mp3',
      'rain': '/rain-falling.mp3',
      'raining': '/rain-falling.mp3',
      'thunder': '/thunder-storm.mp3',
      'wind': '/wind-blowing.mp3',
      'fire': '/fireplace-crackling.mp3',
      'fireplace': '/fireplace-crackling.mp3',
      'rummaging': '/cabinet.mp3',
      'pull': '/cabinet.mp3',
      'pulls': '/cabinet.mp3',
        
      // PEN TAPPING SOUNDS
      'tap': '/pen-tapping-on-table.wav',
      'tapping': '/pen-tapping-on-table.wav',
      'pen': '/vintage-writing-sounds.mp3',

      // DOODLING & DRAWING SOUNDS
      'doodle': '/pen-writing.mp3',
      'doodling': '/pen-writing.mp3',
      'draw': '/pen-writing.mp3',
      'drawing': '/pen-writing.mp3',
      'pad': '/paper.mp3',
      'imaginary': '/pen-writing.mp3',

      // ADDITIONAL DRAWING SOUNDS
      'erase': '/eraser-sound-effect.mp3',
      'erases': '/eraser-sound-effect.mp3',
      'pencil': '/pencil-writing-sound-effect.mp3',
      'frown': '/thinking with frown.mp3',
      'concentration': '/thinking with frown.mp3',
      'stare': '/visual-focus.mp3',
      'canvas': '/paper-flutter.mp3',
      'pickup': '/pencil-writing-sound-effect.mp3',
      'marks': '/eraser-sound.mp3',

      // HOSPITAL/CLINIC SOUNDS
      'heartbeat': '/heartbeat-monitor.mp3',
      'monitor': '/heartbeat-monitor.mp3',
      'beep': '/medical-beep.mp3',
      'medical': '/medical-beep.mp3',
      'stethoscope': '/stethoscope-heartbeat.mp3',
      'scrubs': '/scrubs-rustling.mp3',
      'hospital': '/hospital-background.mp3',
      'clinic': '/hospital-background.mp3',

      // NATURE & BACKGROUND SOUNDS
      'birds': '/birds-chirping.mp3',
      'forest': '/forest-ambience.mp3',
      'ocean': '/ocean-waves.mp3',
      'waves': '/ocean-waves.mp3',
      'stream': '/stream-flowing.mp3',
      'creek': '/stream-flowing.mp3',
      'night': '/night-crickets.mp3',
      'crickets': '/night-crickets.mp3',

      // URBAN & CITY SOUNDS
      'city': '/city-traffic.mp3',
      'traffic': '/city-traffic.mp3',
      'cars': '/city-traffic.mp3',
      'park': '/park-ambience.mp3',
      'children': '/children-playing.mp3',
      'kids': '/children-playing.mp3',
      'playground': '/children-playing.mp3',

      // MUSIC & INSTRUMENTS
      'piano': '/piano-soft.mp3',
      'violin': '/violin-soft.mp3',
      'guitar': '/acoustic-guitar.mp3',
      'harp': '/harp-strings.mp3',
      'flute': '/flute-melody.mp3',
      'orchestra': '/orchestra-soft.mp3',
      'music': '/background-music.mp3',
      'melody': '/background-music.mp3',

      // CLOCK & TIME SOUNDS
      'clock': '/clock-ticking.mp3',
      'ticking': '/clock-ticking.mp3',
      'alarm': '/alarm-clock.mp3',
      'bell': '/bell-ringing.mp3',

      // ANIMAL SOUNDS
      'dog': '/dog-barking.mp3',
      'cat': '/cat-meow.mp3',
      'bird': '/bird-singing.mp3',

      // WEATHER SOUNDS
      'storm': '/thunder-storm.mp3',
      'lightning': '/thunder-storm.mp3',

      // GENDER-NEUTRAL DEFAULT
      'default': '/click.mp3'
    };
    
    console.log('🎵 Enhanced sound service initialized with gender support');
  }

  // Set current gender for sound selection
  setGender(gender) {
    if (gender === 'male' || gender === 'female') {
      this.currentGender = gender;
      console.log(`🎵 Sound gender set to: ${gender}`);
    }
  }

  // Get gender-specific sound file path
  getLocalFilePath(action) {
    // First check if it's a gender-specific sound
    const genderSounds = this.genderSoundMappings[this.currentGender];
    if (genderSounds && genderSounds[action]) {
      return genderSounds[action];
    }
    
    // Then check gender-neutral sounds
    if (this.genderNeutralMappings[action]) {
      return this.genderNeutralMappings[action];
    }
    
    // Partial match for gender-specific sounds
    const firstWord = action.split(' ')[0];
    if (genderSounds && genderSounds[firstWord]) {
      return genderSounds[firstWord];
    }
    
    // Partial match for gender-neutral sounds
    if (this.genderNeutralMappings[firstWord]) {
      return this.genderNeutralMappings[firstWord];
    }
    
    // Keyword matching for gender-specific sounds
    if (genderSounds) {
      for (const [key, filePath] of Object.entries(genderSounds)) {
        if (action.includes(key) || key.includes(action)) {
          return filePath;
        }
      }
    }
    
    // Keyword matching for gender-neutral sounds
    for (const [key, filePath] of Object.entries(this.genderNeutralMappings)) {
      if (action.includes(key) || key.includes(action)) {
        return filePath;
      }
    }
    
    // Default fallback - use gender-specific default if available
    return genderSounds?.default || this.genderNeutralMappings.default;
  }

  // Enhanced sound settings with gender-specific volumes
  getSoundSettings(action) {
    const baseSoundMappings = {
      // EMOTIONAL SOUNDS - GENDER-SPECIFIC VOLUMES
      'laugh': {
        maxDuration: this.currentGender === 'male' ? 2.5 : 3.0,
        volume: this.currentGender === 'male' ? 0.28 : 0.25,
        fadeOut: this.currentGender === 'male' ? 0.3 : 0.4
      },
      'chuckle': {
        maxDuration: this.currentGender === 'male' ? 1.8 : 2.0,
        volume: this.currentGender === 'male' ? 0.25 : 0.22,
        fadeOut: this.currentGender === 'male' ? 0.25 : 0.3
      },
      'sigh': {
        maxDuration: this.currentGender === 'male' ? 3.0 : 3.5,
        volume: this.currentGender === 'male' ? 0.20 : 0.18,
        fadeOut: this.currentGender === 'male' ? 0.5 : 0.6
      },
      'gasp': {
        maxDuration: 1.8,
        volume: this.currentGender === 'male' ? 0.32 : 0.3,
        fadeOut: 0.2
      },
      'smile': {
        maxDuration: 1.0,
        volume: this.currentGender === 'male' ? 0.14 : 0.12,
        fadeOut: 0.2
      },
      'cry': {
        maxDuration: this.currentGender === 'male' ? 3.5 : 4.0,
        volume: this.currentGender === 'male' ? 0.22 : 0.2,
        fadeOut: this.currentGender === 'male' ? 0.7 : 0.8
      },
      'sob': {
        maxDuration: this.currentGender === 'male' ? 2.5 : 3.0,
        volume: this.currentGender === 'male' ? 0.20 : 0.18,
        fadeOut: this.currentGender === 'male' ? 0.5 : 0.6
      },
      'giggle': {
        maxDuration: this.currentGender === 'male' ? 1.5 : 2.0,
        volume: this.currentGender === 'male' ? 0.22 : 0.2,
        fadeOut: this.currentGender === 'male' ? 0.25 : 0.3
      },

      // ENVIRONMENTAL & ACTION SOUNDS
      'walk': {
        maxDuration: 3.0,
        volume: 0.15,
        fadeOut: 0.3
      },
      'running': {
        maxDuration: 2.5,
        volume: 0.18,
        fadeOut: 0.3
      },
      'pour': {
        maxDuration: 4.0,
        volume: 0.18,
        fadeOut: 0.4
      },
      'coffee': {
        maxDuration: 5.0,
        volume: 0.2,
        fadeOut: 0.5
      },
      'grind': {
        maxDuration: 4.0,
        volume: 0.22,
        fadeOut: 0.6
      },
      'cabinet': {
        maxDuration: 2.0,
        volume: 0.15,
        fadeOut: 0.3
      },
      'cup': {
        maxDuration: 1.5,
        volume: 0.12,
        fadeOut: 0.2
      },
      'door': {
        maxDuration: 2.0,
        volume: 0.18,
        fadeOut: 0.3
      },
      'paper': {
        maxDuration: 2.0,
        volume: 0.12,
        fadeOut: 0.3
      },
      'write': {
        maxDuration: 3.0,
        volume: 0.1,
        fadeOut: 0.4
      },
      'type': {
        maxDuration: 3.0,
        volume: 0.12,
        fadeOut: 0.4
      },
      'rummaging': {
        maxDuration: 2.0,
        volume: 0.12,
        fadeOut: 0.3
      },
      'pull': {
        maxDuration: 1.0,
        volume: 0.15,
        fadeOut: 0.2
      },
      'pulls': {
        maxDuration: 1.0,
        volume: 0.15,
        fadeOut: 0.2
      },
      
      // PEN TAPPING SETTINGS
      'tap': {
        maxDuration: 2.0,
        volume: 0.1,
        fadeOut: 0.1
      },
      'tapping': {
        maxDuration: 2.0,
        volume: 0.1,
        fadeOut: 0.1
      },
      'pen': {
        maxDuration: 2.0,
        volume: 0.1,
        fadeOut: 0.1
      },

      // DOODLING & DRAWING SETTINGS
      'scribble': {
        maxDuration: 1.5,
        volume: 0.09,
        fadeOut: 0.2
      },
      'scribbling': {
        maxDuration: 1.5,
        volume: 0.09,
        fadeOut: 0.2
      },
      'doodle': {
        maxDuration: 2.0,
        volume: 0.08,
        fadeOut: 0.3
      },
      'doodling': {
        maxDuration: 2.0,
        volume: 0.08,
        fadeOut: 0.3
      },
      'draw': {
        maxDuration: 2.0,
        volume: 0.08,
        fadeOut: 0.3
      },
      'drawing': {
        maxDuration: 2.0,
        volume: 0.08,
        fadeOut: 0.3
      },
      'pad': {
        maxDuration: 1.0,
        volume: 0.06,
        fadeOut: 0.2
      },
      'imaginary': {
        maxDuration: 1.5,
        volume: 0.07,
        fadeOut: 0.3
      },

      // ADDITIONAL DRAWING SOUND SETTINGS
      'erase': {
        maxDuration: 1.2,
        volume: 0.08,
        fadeOut: 0.2
      },
      'erases': {
        maxDuration: 1.2,
        volume: 0.08,
        fadeOut: 0.2
      },
      'pencil': {
        maxDuration: 0.8,
        volume: 0.07,
        fadeOut: 0.1
      },
      'frown': {
        maxDuration: 1.0,
        volume: 0.05,
        fadeOut: 0.3
      },
      'concentration': {
        maxDuration: 1.5,
        volume: 0.06,
        fadeOut: 0.4
      },
      'stare': {
        maxDuration: 1.2,
        volume: 0.04,
        fadeOut: 0.3
      },
      'canvas': {
        maxDuration: 0.7,
        volume: 0.05,
        fadeOut: 0.2
      },
      'pickup': {
        maxDuration: 0.8,
        volume: 0.07,
        fadeOut: 0.1
      },
      'marks': {
        maxDuration: 1.2,
        volume: 0.08,
        fadeOut: 0.2
      },

      // HOSPITAL/CLINIC SOUNDS
      'heartbeat': {
        maxDuration: 6.0,
        volume: 0.15,
        fadeOut: 0.8
      },
      'monitor': {
        maxDuration: 5.0,
        volume: 0.12,
        fadeOut: 0.6
      },
      'beep': {
        maxDuration: 2.0,
        volume: 0.1,
        fadeOut: 0.2
      },
      'stethoscope': {
        maxDuration: 4.0,
        volume: 0.15,
        fadeOut: 0.5
      },

      // NATURE & BACKGROUND SOUNDS
      'rain': {
        maxDuration: 8.0,
        volume: 0.16,
        fadeOut: 1.0
      },
      'thunder': {
        maxDuration: 4.0,
        volume: 0.25,
        fadeOut: 0.6
      },
      'wind': {
        maxDuration: 7.0,
        volume: 0.14,
        fadeOut: 0.9
      },
      'fire': {
        maxDuration: 8.0,
        volume: 0.18,
        fadeOut: 1.0
      },
      'birds': {
        maxDuration: 6.0,
        volume: 0.15,
        fadeOut: 0.8
      },
      'forest': {
        maxDuration: 8.0,
        volume: 0.16,
        fadeOut: 1.0
      },
      'ocean': {
        maxDuration: 8.0,
        volume: 0.18,
        fadeOut: 1.0
      },
      'stream': {
        maxDuration: 7.0,
        volume: 0.15,
        fadeOut: 0.9
      },
      'night': {
        maxDuration: 8.0,
        volume: 0.12,
        fadeOut: 1.0
      },

      // URBAN & CITY SOUNDS
      'city': {
        maxDuration: 8.0,
        volume: 0.2,
        fadeOut: 1.0
      },
      'traffic': {
        maxDuration: 8.0,
        volume: 0.18,
        fadeOut: 1.0
      },
      'park': {
        maxDuration: 7.0,
        volume: 0.16,
        fadeOut: 0.9
      },
      'children': {
        maxDuration: 6.0,
        volume: 0.2,
        fadeOut: 0.8
      },

      // MUSIC & INSTRUMENTS
      'piano': {
        maxDuration: 10.0,
        volume: 0.15,
        fadeOut: 1.5
      },
      'violin': {
        maxDuration: 10.0,
        volume: 0.14,
        fadeOut: 1.5
      },
      'guitar': {
        maxDuration: 8.0,
        volume: 0.16,
        fadeOut: 1.2
      },
      'harp': {
        maxDuration: 9.0,
        volume: 0.13,
        fadeOut: 1.3
      },
      'flute': {
        maxDuration: 7.0,
        volume: 0.14,
        fadeOut: 1.0
      },
      'orchestra': {
        maxDuration: 12.0,
        volume: 0.18,
        fadeOut: 2.0
      },
      'music': {
        maxDuration: 15.0,
        volume: 0.12,
        fadeOut: 2.0
      },

      // CLOCK & TIME SOUNDS
      'clock': {
        maxDuration: 5.0,
        volume: 0.08,
        fadeOut: 0.6
      },
      'alarm': {
        maxDuration: 3.0,
        volume: 0.25,
        fadeOut: 0.4
      },
      'bell': {
        maxDuration: 2.0,
        volume: 0.2,
        fadeOut: 0.3
      },

      // ANIMAL SOUNDS
      'dog': {
        maxDuration: 2.0,
        volume: 0.22,
        fadeOut: 0.3
      },
      'cat': {
        maxDuration: 1.5,
        volume: 0.18,
        fadeOut: 0.2
      },
      'bird': {
        maxDuration: 3.0,
        volume: 0.15,
        fadeOut: 0.4
      },

      // PAUSE & SILENCE
      'pause': {
        maxDuration: 1.0,
        volume: 0,
        fadeOut: 0
      },
      'silence': {
        maxDuration: 1.5,
        volume: 0,
        fadeOut: 0
      },

      // DEFAULT
      'default': {
        maxDuration: 1.0,
        volume: 0.1,
        fadeOut: 0.2
      }
    };

    // Find the best matching sound mapping
    let settings = baseSoundMappings.default;
    
    // Exact match
    if (baseSoundMappings[action]) {
      settings = baseSoundMappings[action];
    } else {
      // Partial match
      const firstWord = action.split(' ')[0];
      if (baseSoundMappings[firstWord]) {
        settings = baseSoundMappings[firstWord];
      } else {
        // Keyword matching
        for (const [key, value] of Object.entries(baseSoundMappings)) {
          if (action.includes(key) || key.includes(action)) {
            settings = value;
            break;
          }
        }
      }
    }

    return { ...settings, action };
  }

  async initialize() {
    if (this.isInitialized) return true;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.isInitialized = true;
      console.log('🎵 Sound service ready');
      return true;
    } catch (error) {
      console.warn('❌ Sound service initialization failed:', error);
      return false;
    }
  }

  // Check if local file exists
  async checkLocalFileExists(filePath) {
    return new Promise((resolve) => {
      const fullUrl = this.localSoundBase + filePath;
      
      const audio = new Audio();
      audio.src = fullUrl;
      
      audio.oncanplaythrough = () => {
        console.log(`✅ Local file exists: ${filePath}`);
        resolve(true);
      };
      
      audio.onerror = () => {
        console.log(`❌ Local file not found: ${filePath}`);
        resolve(false);
      };
      
      setTimeout(() => {
        resolve(false);
      }, 1000);
    });
  }

  async getSoundForAction(action) {
    const settings = this.getSoundSettings(action);
    
    // Check cache first with gender prefix
    const cacheKey = `${this.currentGender}:${action}`;
    if (this.soundCache.has(cacheKey)) {
      console.log(`🎵 Using cached ${this.currentGender} sound for: "${action}"`);
      const cached = this.soundCache.get(cacheKey);
      return { ...settings, url: cached.url, source: cached.source };
    }

    // Special case for pause/silence
    if (action.includes('pause') || action.includes('silence')) {
      return { ...settings, url: null, source: 'silence' };
    }

    // STEP 1: Try local file first
    const localFilePath = this.getLocalFilePath(action);
    const localFileUrl = this.localSoundBase + localFilePath;
    const localFileExists = await this.checkLocalFileExists(localFilePath);
    
    if (localFileExists) {
      console.log(`📁 Using ${this.currentGender} file for: "${action}" -> ${localFilePath}`);
      this.soundCache.set(cacheKey, { url: localFileUrl, source: 'local' });
      return { ...settings, url: localFileUrl, source: 'local' };
    }

    // STEP 2: Use generated sound
    console.log(`🎵 No local file, using generated ${this.currentGender} sound for: "${action}"`);
    return { ...settings, url: null, source: 'generated' };
  }

  extractActions(text) {
    const actionRegex = /\*([^*]+)\*|\(([^)]+)\)/g;
    const actions = [];
    let match;
    
    // Expanded allowed actions list with all sounds including new actions
    const allowedActions = [
      // Emotional
      'laugh', 'chuckle', 'sigh', 'gasp', 'cry', 'sob', 'weep', 'smile', 'grin', 'giggle', 'snicker',
      // Environmental
      'walk', 'walking', 'footsteps', 'run', 'running', 'pour', 'pouring', 'water', 'coffee', 
      'coffee machine', 'grind', 'grinding', 'cabinet', 'cup', 'cups', 'pause', 'silence', 'door', 
      'paper', 'write', 'writing', 'type', 'typing', 'phone', 'ring',
      // Pen tapping
      'tap', 'tapping', 'pen',
      // Cabinet actions
      'rummaging', 'pull', 'pulls',
      // Doodling and drawing actions
      'doodle', 'doodling', 'draw', 'drawing', 'scribble', 'scribbling', 'pad', 'imaginary',
      // Additional drawing actions from conversation
      'erase', 'erases', 'pencil', 'frown', 'concentration', 'stare', 'canvas', 'pickup', 'marks',
      // Nature
      'rain', 'raining', 'thunder', 'wind', 'fire', 'fireplace', 'birds', 'forest', 'ocean', 'waves',
      'stream', 'creek', 'night', 'crickets', 'storm', 'lightning',
      // Urban
      'city', 'traffic', 'cars', 'park', 'children', 'kids', 'playground',
      // Hospital
      'heartbeat', 'monitor', 'beep', 'medical', 'stethoscope', 'scrubs', 'hospital', 'clinic',
      // Music
      'piano', 'violin', 'guitar', 'harp', 'flute', 'orchestra', 'music', 'melody',
      // Time
      'clock', 'ticking', 'alarm', 'bell',
      // Animals
      'dog', 'cat', 'bird'
    ];
    
    while ((match = actionRegex.exec(text)) !== null) {
      // match[1] is for *actions*, match[2] is for (narrative descriptions)
      const action = (match[1] || match[2]).trim().toLowerCase();
      
      const isAllowed = allowedActions.some(allowed => 
        action === allowed || 
        action.startsWith(allowed + ' ') ||
        action.includes(allowed)
      );
      
      if (isAllowed) {
        actions.push(action);
        console.log(`✅ Action detected: "${action}"`);
      } else {
        console.log(`⚠️ Unknown action: "${action}" - will use default sound`);
        actions.push(action);
      }
    }
    
    return actions;
  }

  async playSoundForAction(action) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const soundConfig = await this.getSoundForAction(action);
    console.log(`🔊 ${this.currentGender} sound source for "${action}": ${soundConfig.source}`);
    
    await this.playSoundFromConfig(action, soundConfig);
  }

  async playSoundFromConfig(action, soundConfig) {
    // Handle silence/pause
    if (soundConfig.source === 'silence') {
      console.log('⏸️ Playing brief pause');
      await new Promise(resolve => setTimeout(resolve, soundConfig.maxDuration * 1000));
      return;
    }

    // Handle local files
    if (soundConfig.source === 'local' && soundConfig.url) {
      await this.playSound(soundConfig.url, soundConfig);
      return;
    }

    // Handle generated sounds
    if (soundConfig.source === 'generated') {
      await this.playGeneratedSound(action, soundConfig);
      return;
    }

    // Final fallback
    await this.playGeneratedSound(action, soundConfig);
  }

  async playSound(url, settings) {
    if (!this.audioContext) {
      console.warn('Audio context not available');
      await this.playGeneratedSound(settings.action, settings);
      return;
    }

    // Wait if something is already playing
    while (this.isPlaying) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isPlaying = true;

    try {
      // Check cache for this specific URL
      if (this.soundCache.has(url)) {
        const audioBuffer = this.soundCache.get(url);
        await this.playAudioBuffer(audioBuffer, settings);
        return;
      }

      // Load the sound
      console.log(`🔊 Loading sound from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Sound download failed: ${url}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Cache the sound
      this.soundCache.set(url, audioBuffer);
      
      // Play the sound
      await this.playAudioBuffer(audioBuffer, settings);
      
    } catch (error) {
      console.warn(`Sound playback failed for ${url}:`, error);
      await this.playGeneratedSound(settings.action, settings);
    } finally {
      this.isPlaying = false;
    }
  }

  async playAudioBuffer(audioBuffer, settings) {
    return new Promise((resolve) => {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = audioBuffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      this.activeSources.add(source);
      
      gainNode.gain.value = settings.volume;
      
      const actualDuration = audioBuffer.duration;
      const playDuration = Math.min(actualDuration, settings.maxDuration);
      
      console.log(`🔊 Playing: ${actualDuration.toFixed(1)}s sound for ${playDuration.toFixed(1)}s (${settings.source})`);
      
      const fadeOutStart = this.audioContext.currentTime + playDuration - settings.fadeOut;
      const stopTime = this.audioContext.currentTime + playDuration;
      
      gainNode.gain.setValueAtTime(settings.volume, fadeOutStart);
      gainNode.gain.exponentialRampToValueAtTime(0.001, stopTime);
      
      source.start();
      source.stop(stopTime);
      
      source.onended = () => {
        this.activeSources.delete(source);
        console.log('🔊 Sound finished');
        resolve();
      };
      
      setTimeout(() => {
        if (this.activeSources.has(source)) {
          source.stop();
          this.activeSources.delete(source);
        }
        resolve();
      }, (playDuration + 0.5) * 1000);
    });
  }

  // Enhanced generated sounds with gender variations
  async playGeneratedSound(action, settings) {
    if (!this.audioContext) return;
    
    try {
      console.log(`🎵 Playing generated ${this.currentGender} sound for: "${action}" (${settings.maxDuration}s)`);
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Gender-specific sound profiles
      const genderSoundProfiles = {
        'female': {
          'laugh': { 
            freq: [320, 480, 380, 420, 360], 
            duration: 2.0, 
            volume: 0.15,
            type: 'sawtooth'
          },
          'chuckle': { 
            freq: [380, 340, 360, 350], 
            duration: 1.2, 
            volume: 0.12,
            type: 'sine'
          },
          'sigh': { 
            freq: [220, 180, 160, 170, 190], 
            duration: 3.5,
            volume: 0.1,
            type: 'sine'
          },
          'cry': { 
            freq: [340, 320, 300, 310, 330], 
            duration: 4.0, 
            volume: 0.16,
            type: 'sawtooth'
          },
          'giggle': { 
            freq: [400, 360, 380, 370], 
            duration: 1.5, 
            volume: 0.13,
            type: 'sine'
          },
          'default': { 
            freq: [500, 600], 
            duration: 0.5, 
            volume: 0.08,
            type: 'sine'
          }
        },
        'male': {
          'laugh': { 
            freq: [180, 280, 220, 240, 200], 
            duration: 2.5, 
            volume: 0.18,
            type: 'sawtooth'
          },
          'chuckle': { 
            freq: [220, 200, 210, 190], 
            duration: 1.8, 
            volume: 0.15,
            type: 'sine'
          },
          'sigh': { 
            freq: [140, 120, 110, 115, 125], 
            duration: 3.0,
            volume: 0.12,
            type: 'sine'
          },
          'cry': { 
            freq: [200, 180, 170, 175, 185], 
            duration: 3.5, 
            volume: 0.18,
            type: 'sawtooth'
          },
          'giggle': { 
            freq: [260, 240, 250, 230], 
            duration: 1.2, 
            volume: 0.14,
            type: 'sine'
          },
          'default': { 
            freq: [300, 400], 
            duration: 0.5, 
            volume: 0.1,
            type: 'sine'
          }
        }
      };
      
      const genderProfiles = genderSoundProfiles[this.currentGender] || genderSoundProfiles.female;
      const profile = genderProfiles[action] || genderProfiles.default;
      const actualDuration = settings.maxDuration || profile.duration;
      
      oscillator.frequency.setValueAtTime(profile.freq[0], this.audioContext.currentTime);
      oscillator.type = profile.type;
      
      // Create complex patterns for longer sounds
      if (profile.freq.length > 1 && actualDuration > 1.0) {
        const timeStep = actualDuration / (profile.freq.length - 1);
        
        for (let i = 1; i < profile.freq.length; i++) {
          oscillator.frequency.exponentialRampToValueAtTime(
            profile.freq[i], 
            this.audioContext.currentTime + timeStep * i
          );
        }
      }
      
      gainNode.gain.value = settings.volume || profile.volume;
      
      oscillator.start();
      
      // Smooth fade out
      const fadeOutStart = this.audioContext.currentTime + actualDuration - (settings.fadeOut || 0.5);
      gainNode.gain.setValueAtTime(settings.volume || profile.volume, fadeOutStart);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + actualDuration);
      
      oscillator.stop(this.audioContext.currentTime + actualDuration);
      
      await new Promise(resolve => setTimeout(resolve, actualDuration * 1000 + 100));
      
    } catch (error) {
      console.warn('Generated sound failed:', error);
    }
  }

  async handleActions(text) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const actions = this.extractActions(text);
    
    if (actions.length === 0) {
      return;
    }

    console.log('🎭 Processing actions:', actions);

    // Process each action WITHOUT pauses between them
    for (let i = 0; i < actions.length; i++) {
      try {
        const action = actions[i];
        await this.playSoundForAction(action);
        
        // Only add minimal technical delay if needed
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        console.warn(`Action failed: "${action}"`, error);
        await this.playGeneratedSound(action);
      }
    }
  }

  // Simplified - no more artificial pauses
  getPauseDuration(currentAction, currentIndex, totalActions) {
    return 0; // No pauses between action sounds and speech
  }

  stopAllSounds() {
    console.log('🔇 Stopping all active sounds');
    this.activeSources.forEach(source => {
      try {
        source.stop();
      } catch (error) {}
    });
    this.activeSources.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.isPlaying = false;
    }
  }

  cleanup() {
    this.soundCache.clear();
    this.stopAllSounds();
  }
}

export const freesoundService = new FreesoundService();