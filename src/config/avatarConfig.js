// src/config/avatarConfig.js - UPDATED
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// API Endpoints
export const CHAT_BRAIN_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
export const ELEVENLABS_API_URL_PREFIX = "https://api.elevenlabs.io/v1/text-to-speech/";

// Voice to gender mapping
export const voiceGenderMap = {
  'sarah': 'female',
  'megan': 'female', 
  'theo': 'male',
  'jack': 'male'
};

// Persona configurations
export const personaConfigs = {
  'Dr. Elara': {
    gender: 'female',
    displayName: 'Dr. Elara',
    description: 'A compassionate doctor with a warm demeanor'
  },
  'Dr. Theo': {
    gender: 'male',
    displayName: 'Dr. Theo', 
    description: 'A confident medical professional'
  }
};

// Video path mappings
export const videoPathMap = {
  // Female videos (Dr. Elara)
  'scared': 'Fearful_Medic_Emergency_Room - TRIM - Videobolt.net.mp4',
  'neutral': 'Content_Healthcare_Pro_Teal_Scrubs - TRIM - Videobolt.net.mp4',
  'joyful': 'Joyful_Nurse_Talking_Radiant - TRIM - Videobolt.net.mp4',
  'concerned': 'Anxious_Healthcare_Worker_Hallway - TRIM - Videobolt.net.mp4',
  'thoughtful': 'Empathetic_Clinician_Explains_Medical_Info - TRIM - Videobolt.net.mp4',
  'explain': 'Animated_Navy_Medic_Explains - TRIM - Videobolt.net.mp4',
  'smile': 'Smiling_Nurse_Confident_Professional - TRIM - Videobolt.net.mp4',
  'excited': 'Excited_Pediatrician_Good_News - TRIM - Videobolt.net.mp4',
  'sad': 'Sad_Healthcare_Worker_Hospital_Setting - TRIM - Videobolt.net.mp4',
  'angry': 'Angry_Scrub_Professional - TRIM - Videobolt.net.mp4',
  'surprised': 'Surprised_Healthcare_Professional - TRIM - Videobolt.net.mp4',
  'fearful': 'Fearful_Medic_Emergency_Room - TRIM - Videobolt.net.mp4',
  'empathetic': 'Empathetic_Clinician_Explains_Medical_Info - TRIM - Videobolt.net.mp4',
  
  // Mapping 'thinking' and 'curious' to the thoughtful video
  'thinking': 'Animated_Navy_Medic_Explains - TRIM - Videobolt.net.mp4',
  'curious': 'Animated_Navy_Medic_Explains - TRIM - Videobolt.net.mp4', 
  
  'revulsed': 'Anxious_Healthcare_Worker_Hallway - TRIM - Videobolt.net.mp4',
  'shocked': 'Surprised_Healthcare_Professional - TRIM - Videobolt.net.mp4',
  
  // Male videos (Dr. Theo)
  'male_neutral': 'male_theo_neutral.mp4',
  'male_joyful': 'male_theo_happy.mp4',
  'male_concerned': 'male_theo_concerned.mp4',
  'male_thoughtful': 'male_theo_thinking.mp4',
  'male_curious': 'male_theo_thinking.mp4', // Added male curious
  'male_explain': 'male_theo_explaining.mp4',
  'male_smile': 'male_theo_happy.mp4',
  'male_angry': 'male_theo_angry.mp4',
  'male_surprised': 'male_theo_surprised.mp4',
  'male_scared': 'male_theo_scared.mp4',
  'male_excited': 'male_theo_excited.mp4',
  'male_sad': 'male_theo_sad.mp4'
};

const getVideoPath = (gender, emotion) => {
  const basePath = '/videos/avatar/';
  // Handle 'curious' mapping to 'thoughtful' logic internally if needed, 
  // but explicit keys in videoPathMap above is safer.
  const videoKey = gender === 'male' ? `male_${emotion}` : emotion;
  const fileName = videoPathMap[videoKey] || videoPathMap[emotion] || videoPathMap['neutral'];
  return `${basePath}${fileName}`;
};

export const avatarManifest = {
  personas: {
    'Dr. Elara': {
      gender: 'female',
      description: 'A compassionate doctor with a warm demeanor',
      emotions: {
        // ... existing emotions ...
        scared: { video: getVideoPath('female', 'scared'), animation: 'slow-pulse', scale: 1.0, transformOrigin: '50% 50%' },
        neutral: { image: '/images/avatar/elara_neutral.png', video: getVideoPath('female', 'neutral'), animation: 'breathing', scale: 1.0, transformOrigin: '50% 50%' },
        joyful: { image: '/images/avatar/elara_joyful.png', video: getVideoPath('female', 'joyful'), animation: 'gentle-bounce', scale: 1.1, transformOrigin: '50% 50%' },
        concerned: { image: '/images/avatar/elara_concerned.png', video: getVideoPath('female', 'concerned'), animation: 'slow-pulse', scale: 1.0, transformOrigin: '50% 50%' },
        thoughtful: { image: '/images/avatar/elara_thoughtful.png', video: getVideoPath('female', 'thoughtful'), animation: 'thoughtful-nod', scale: 1.0, transformOrigin: '50% 50%' },
        explain: { video: getVideoPath('female', 'explain'), animation: 'breathing', scale: 1.0, transformOrigin: '50% 50%' },
        smile: { video: getVideoPath('female', 'smile'), animation: 'gentle-bounce', scale: 1.05, transformOrigin: '50% 50%' },
        excited: { video: getVideoPath('female', 'excited'), animation: 'gentle-bounce', scale: 1.1, transformOrigin: '50% 50%' },
        sad: { video: getVideoPath('female', 'sad'), animation: 'slow-pulse', scale: 0.98, transformOrigin: '50% 50%' },
        revulsed: { video: getVideoPath('female', 'revulsed'), animation: 'slow-pulse', scale: 1.0, transformOrigin: '50% 50%' },
        angry: { video: getVideoPath('female', 'angry'), animation: 'breathing', scale: 1.0, transformOrigin: '50% 50%' },
        surprised: { video: getVideoPath('female', 'surprised'), animation: 'quick-bounce', scale: 1.05, transformOrigin: '50% 50%' },
        shocked: { video: getVideoPath('female', 'shocked'), animation: 'quick-bounce', scale: 1.05, transformOrigin: '50% 50%' },
        fearful: { video: getVideoPath('female', 'fearful'), animation: 'slow-pulse', scale: 1.0, transformOrigin: '50% 50%' },
        empathetic: { video: getVideoPath('female', 'empathetic'), animation: 'thoughtful-nod', scale: 1.0, transformOrigin: '50% 50%' },
        thinking: { video: getVideoPath('female', 'thinking'), animation: 'thoughtful-nod', scale: 1.0, transformOrigin: '50% 50%' },
        
        // ADDED CURIOUS EXPLICITLY
        curious: { 
          video: getVideoPath('female', 'curious'), 
          animation: 'thoughtful-nod', 
          scale: 1.05, 
          transformOrigin: '50% 50%' 
        }
      },
      defaultEmotion: 'neutral'
    },

    'Dr. Theo': {
      gender: 'male',
      description: 'A confident medical professional',
      emotions: {
        neutral: { image: '/images/avatar/theo_neutral.png', video: getVideoPath('male', 'neutral'), animation: 'breathing', scale: 1.0, transformOrigin: '50% 50%' },
        joyful: { image: '/images/avatar/theo_joyful.png', video: getVideoPath('male', 'joyful'), animation: 'gentle-bounce', scale: 1.1, transformOrigin: '50% 50%' },
        concerned: { image: '/images/avatar/theo_concerned.png', video: getVideoPath('male', 'concerned'), animation: 'slow-pulse', scale: 1.0, transformOrigin: '50% 50%' },
        thoughtful: { image: '/images/avatar/theo_thoughtful.png', video: getVideoPath('male', 'thoughtful'), animation: 'thoughtful-nod', scale: 1.0, transformOrigin: '50% 50%' },
        explain: { video: getVideoPath('male', 'explain'), animation: 'breathing', scale: 1.0, transformOrigin: '50% 50%' },
        smile: { video: getVideoPath('male', 'smile'), animation: 'gentle-bounce', scale: 1.05, transformOrigin: '50% 50%' },
        angry: { video: getVideoPath('male', 'angry'), animation: 'breathing', scale: 1.0, transformOrigin: '50% 50%' },
        surprised: { video: getVideoPath('male', 'surprised'), animation: 'quick-bounce', scale: 1.05, transformOrigin: '50% 50%' },
        scared: { video: getVideoPath('male', 'scared'), animation: 'slow-pulse', scale: 1.0, transformOrigin: '50% 50%' },
        excited: { video: getVideoPath('male', 'excited'), animation: 'gentle-bounce', scale: 1.1, transformOrigin: '50% 50%' },
        sad: { video: getVideoPath('male', 'sad'), animation: 'slow-pulse', scale: 0.98, transformOrigin: '50% 50%' },
        
        // ADDED CURIOUS FOR MALE
        curious: { 
          video: getVideoPath('male', 'curious'), 
          animation: 'thoughtful-nod', 
          scale: 1.0, 
          transformOrigin: '50% 50%' 
        }
      },
      defaultEmotion: 'neutral'
    }
  },
  
  scenes: {
    'clinic_intro': {
      video: '/videos/clinic_intro.mp4',
      personas: {
        'Dr. Elara': { position: { scale: 1.8, x: '-25%', y: '10%' }, emotion: 'neutral' }
      }
    }
  },
  
  animations: {
    'breathing': { keyframes: `@keyframes breathing { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }`, style: { animation: 'breathing 3s ease-in-out infinite' } },
    'gentle-bounce': { keyframes: `@keyframes gentleBounce { 0%, 100% { transform: translateY(0px) scale(1.1); } 50% { transform: translateY(-8px) scale(1.12); } }`, style: { animation: 'gentleBounce 4s ease-in-out infinite' } },
    'slow-pulse': { keyframes: `@keyframes slowPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.9; transform: scale(0.98); } }`, style: { animation: 'slowPulse 5s ease-in-out infinite' } },
    'thoughtful-nod': { keyframes: `@keyframes thoughtfulNod { 0%, 100% { transform: rotateZ(0deg) scale(1); } 25% { transform: rotateZ(-1deg) scale(1.01); } 75% { transform: rotateZ(1deg) scale(1.01); } }`, style: { animation: 'thoughtfulNod 6s ease-in-out infinite' } },
    'quick-bounce': { keyframes: `@keyframes quickBounce { 0%, 100% { transform: scale(1.05) translateY(0px); } 50% { transform: scale(1.08) translateY(-5px); } }`, style: { animation: 'quickBounce 2s ease-in-out infinite' } },
    'firm-nod': { keyframes: `@keyframes firmNod { 0%, 100% { transform: scale(1.05) translateY(0px); } 50% { transform: scale(1.05) translateY(-3px); } }`, style: { animation: 'firmNod 3s ease-in-out infinite' } },
    'confident-sway': { keyframes: `@keyframes confidentSway { 0%, 100% { transform: rotateZ(0deg) scale(1.1); } 33% { transform: rotateZ(-0.5deg) scale(1.1); } 66% { transform: rotateZ(0.5deg) scale(1.1); } }`, style: { animation: 'confidentSway 8s ease-in-out infinite' } },
    'still': { keyframes: ``, style: {} }
  }
};

export const getAvatarConfig = (persona, emotion) => {
  const personaData = avatarManifest.personas[persona];
  if (!personaData) return getDefaultConfig();
  
  // Logic to handle missing emotions by falling back to default
  const emotionData = personaData.emotions[emotion] || personaData.emotions[personaData.defaultEmotion];
  
  if (!emotionData) return getDefaultConfig();
  
  const animation = avatarManifest.animations[emotionData.animation] || avatarManifest.animations.breathing;
  
  return {
    image: emotionData.image,
    video: emotionData.video,
    animation: emotionData.animation,
    style: {
      transform: `scale(${emotionData.scale})`,
      transformOrigin: emotionData.transformOrigin,
      ...animation.style
    },
    keyframes: animation.keyframes,
    gender: personaData.gender
  };
};

const getDefaultConfig = () => ({
  image: '/images/avatar/fallback.png',
  video: '/videos/avatar/Content_Healthcare_Pro_Teal_Scrubs - TRIM - Videobolt.net.mp4',
  animation: 'breathing',
  style: avatarManifest.animations.breathing.style,
  keyframes: avatarManifest.animations.breathing.keyframes,
  gender: 'female'
});

export const getPersonaByVoice = (voice) => {
  const gender = voiceGenderMap[voice];
  return gender === 'male' ? 'Dr. Theo' : 'Dr. Elara';
};

export const getAvailablePersonas = () => Object.keys(avatarManifest.personas);

export const getPersonasByGender = (gender) => {
  return Object.keys(avatarManifest.personas).filter(
    persona => avatarManifest.personas[persona].gender === gender
  );
};

export const emotionAliases = {
  'smile': 'smile', 'smiles': 'smile', 'smiling': 'smile', 'grin': 'smile', 'grinning': 'smile',
  'laugh': 'joyful', 'laughs': 'joyful', 'laughing': 'joyful', 'chuckle': 'joyful', 'chuckles': 'joyful', 'giggle': 'joyful',
  'concerned': 'concerned', 'concern': 'concerned', 'worried': 'concerned', 'worry': 'concerned', 'anxious': 'concerned',
  'empathetic': 'empathetic', 'empathy': 'empathetic', 'compassionate': 'empathetic',
  'sad': 'sad', 'sadly': 'sad', 'unhappy': 'sad', 'heartbroken': 'sad', 'cry': 'sad',
  'thoughtful': 'thoughtful', 'thinking': 'thoughtful', 'ponder': 'thoughtful',
  
  // ADDED CURIOUS MAPPING
  'curious': 'curious', 'intrigued': 'curious', 'fascinated': 'curious',
  
  'surprised': 'surprised', 'surprise': 'surprised', 'shocked': 'surprised',
  'angry': 'angry', 'mad': 'angry', 'furious': 'angry',
  'scared': 'scared', 'afraid': 'scared', 'fear': 'scared',
  'disgust': 'revulsed', 'revulsed': 'revulsed',
  'explain': 'explain', 'explaining': 'explain',
  'excited': 'excited', 'thrilled': 'excited'
};

export const apiConfig = {
  gemini: { key: GEMINI_API_KEY, url: CHAT_BRAIN_API_URL },
  elevenLabs: { key: ELEVENLABS_API_KEY, urlPrefix: ELEVENLABS_API_URL_PREFIX }
};

export const validateVideoPaths = () => true;
validateVideoPaths();