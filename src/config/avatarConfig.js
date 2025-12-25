// src/config/avatarConfig.js - UPDATED WITH CONTEXT-AWARE EMOTIONS
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

// Video path mappings - UPDATED WITH ALL EMOTIONS
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
    'surprised': 'elara_surprised.mp4',
    'fearful': 'Fearful_Medic_Emergency_Room - TRIM - Videobolt.net.mp4',
    'empathetic': 'Empathetic_Clinician_Explains_Medical_Info - TRIM - Videobolt.net.mp4',
    'thinking': 'Animated_Navy_Medic_Explains - TRIM - Videobolt.net.mp4',
    'curious': 'Animated_Navy_Medic_Explains - TRIM - Videobolt.net.mp4',
    'revulsed': 'Anxious_Healthcare_Worker_Hallway - TRIM - Videobolt.net.mp4',
    'shocked': 'Surprised_Healthcare_Professional - TRIM - Videobolt.net.mp4',
    'laugh': 'Joyful_Nurse_Talking_Radiant - TRIM - Videobolt.net.mp4',

    // Male videos (Dr. Theo)
    'male_neutral': 'male_theo_neutral.mp4',
    'male_joyful': 'male_theo_happy.mp4',
    'male_concerned': 'male_theo_concerned.mp4',
    'male_thoughtful': 'male_theo_thinking.mp4',
    'male_curious': 'male_theo_thinking.mp4',
    'male_explain': 'male_theo_explaining.mp4',
    'male_smile': 'male_theo_happy.mp4',
    'male_angry': 'male_theo_angry.mp4',
    'male_surprised': 'male_theo_surprised.mp4',
    'male_scared': 'male_theo_scared.mp4',
    'male_excited': 'male_theo_excited.mp4',
    'male_sad': 'male_theo_sad.mp4',
    'male_laugh': 'male_theo_happy.mp4'
};

// FIXED: Better video path function with fallbacks
const getVideoPath = (gender, emotion) => {
    const basePath = '/videos/avatar/';

    // Handle special cases
    if (!emotion || typeof emotion !== 'string') {
        emotion = 'neutral';
    }

    // Convert emotion to lowercase for consistency
    emotion = emotion.toLowerCase();

    // Handle emotion aliases first
    const emotionMap = {
        // Map emotional states to video keys
        'sad': 'sad',
        'frown': 'sad',
        'frowning': 'sad',
        'cry': 'sad',
        'crying': 'sad',

        'joyful': 'joyful',
        'happy': 'joyful',
        'laugh': 'joyful',
        'giggle': 'joyful',
        'laughing': 'joyful',

        'excited': 'excited',
        'excitement': 'excited',
        'bounce': 'excited',
        'bouncing': 'excited',

        'surprised': 'surprised',
        'surprise': 'surprised',
        'shocked': 'surprised',
        'shock': 'surprised',
        'gasp': 'surprised',

        'thoughtful': 'thoughtful',
        'thinking': 'thoughtful',
        'ponder': 'thoughtful',

        'smile': 'smile',
        'smiling': 'smile',
        'grin': 'smile',

        'concerned': 'concerned',
        'worried': 'concerned',
        'anxious': 'concerned',

        'scared': 'scared',
        'afraid': 'scared',
        'fearful': 'scared',

        'angry': 'angry',
        'mad': 'angry',

        'explain': 'explain',
        'explaining': 'explain',

        'curious': 'curious',
        'intrigued': 'curious',

        'empathetic': 'empathetic',
        'empathy': 'empathetic',

        'neutral': 'neutral',
        'calm': 'neutral',
        'normal': 'neutral'
    };

    // Get the standardized emotion
    const standardizedEmotion = emotionMap[emotion] || emotion;

    // Handle male-specific emotions
    const videoKey = gender === 'male' ? `male_${standardizedEmotion}` : standardizedEmotion;

    // Try to get the video file name
    let fileName = videoPathMap[videoKey];

    // If not found for specific gender, try generic
    if (!fileName && gender === 'male') {
        fileName = videoPathMap[standardizedEmotion];
    }

    // If still not found, try some common fallbacks
    if (!fileName) {
        if (emotion.includes('happy') || emotion.includes('joy')) {
            fileName = gender === 'male' ? videoPathMap['male_joyful'] : videoPathMap['joyful'];
        } else if (emotion.includes('sad') || emotion.includes('cry')) {
            fileName = gender === 'male' ? videoPathMap['male_sad'] : videoPathMap['sad'];
        } else if (emotion.includes('surprise') || emotion.includes('shock')) {
            fileName = gender === 'male' ? videoPathMap['male_surprised'] : videoPathMap['surprised'];
        } else if (emotion.includes('excite')) {
            fileName = gender === 'male' ? videoPathMap['male_excited'] : videoPathMap['excited'];
        } else if (emotion.includes('think') || emotion.includes('ponder')) {
            fileName = gender === 'male' ? videoPathMap['male_thoughtful'] : videoPathMap['thoughtful'];
        } else {
            // Final fallback
            fileName = gender === 'male' ? videoPathMap['male_neutral'] : videoPathMap['neutral'];
        }
    }

    return `${basePath}${fileName}`;
};

export const avatarManifest = {
    personas: {
        'Dr. Elara': {
            gender: 'female',
            description: 'A compassionate doctor with a warm demeanor',
            emotions: {
                scared: {
                    video: getVideoPath('female', 'scared'),
                    animation: 'slow-pulse',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                neutral: {
                    image: '/images/avatar/elara_neutral.png',
                    video: getVideoPath('female', 'neutral'),
                    animation: 'breathing',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                joyful: {
                    image: '/images/avatar/elara_joyful.png',
                    video: getVideoPath('female', 'joyful'),
                    animation: 'gentle-bounce',
                    scale: 1.1,
                    transformOrigin: '50% 50%'
                },
                concerned: {
                    image: '/images/avatar/elara_concerned.png',
                    video: getVideoPath('female', 'concerned'),
                    animation: 'slow-pulse',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                thoughtful: {
                    image: '/images/avatar/elara_thoughtful.png',
                    video: getVideoPath('female', 'thoughtful'),
                    animation: 'thoughtful-nod',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                explain: {
                    video: getVideoPath('female', 'explain'),
                    animation: 'breathing',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                smile: {
                    video: getVideoPath('female', 'smile'),
                    animation: 'gentle-bounce',
                    scale: 1.05,
                    transformOrigin: '50% 50%'
                },
                excited: {
                    video: getVideoPath('female', 'excited'),
                    animation: 'gentle-bounce',
                    scale: 1.1,
                    transformOrigin: '50% 50%'
                },
                sad: {
                    video: getVideoPath('female', 'sad'),
                    animation: 'slow-pulse',
                    scale: 0.98,
                    transformOrigin: '50% 50%'
                },
                revulsed: {
                    video: getVideoPath('female', 'revulsed'),
                    animation: 'slow-pulse',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                angry: {
                    video: getVideoPath('female', 'angry'),
                    animation: 'breathing',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                surprised: {
                    video: getVideoPath('female', 'surprised'),
                    animation: 'quick-bounce',
                    scale: 1.05,
                    transformOrigin: '50% 50%'
                },
                shocked: {
                    video: getVideoPath('female', 'shocked'),
                    animation: 'quick-bounce',
                    scale: 1.05,
                    transformOrigin: '50% 50%'
                },
                fearful: {
                    video: getVideoPath('female', 'fearful'),
                    animation: 'slow-pulse',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                empathetic: {
                    video: getVideoPath('female', 'empathetic'),
                    animation: 'thoughtful-nod',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                thinking: {
                    video: getVideoPath('female', 'thinking'),
                    animation: 'thoughtful-nod',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                curious: {
                    video: getVideoPath('female', 'curious'),
                    animation: 'thoughtful-nod',
                    scale: 1.05,
                    transformOrigin: '50% 50%'
                },
                laugh: {
                    video: getVideoPath('female', 'laugh'),
                    animation: 'gentle-bounce',
                    scale: 1.1,
                    transformOrigin: '50% 50%'
                }
            },
            defaultEmotion: 'neutral'
        },

        'Dr. Theo': {
            gender: 'male',
            description: 'A confident medical professional',
            emotions: {
                neutral: {
                    image: '/images/avatar/theo_neutral.png',
                    video: getVideoPath('male', 'neutral'),
                    animation: 'breathing',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                joyful: {
                    image: '/images/avatar/theo_joyful.png',
                    video: getVideoPath('male', 'joyful'),
                    animation: 'gentle-bounce',
                    scale: 1.1,
                    transformOrigin: '50% 50%'
                },
                concerned: {
                    image: '/images/avatar/theo_concerned.png',
                    video: getVideoPath('male', 'concerned'),
                    animation: 'slow-pulse',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                thoughtful: {
                    image: '/images/avatar/theo_thoughtful.png',
                    video: getVideoPath('male', 'thoughtful'),
                    animation: 'thoughtful-nod',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                explain: {
                    video: getVideoPath('male', 'explain'),
                    animation: 'breathing',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                smile: {
                    video: getVideoPath('male', 'smile'),
                    animation: 'gentle-bounce',
                    scale: 1.05,
                    transformOrigin: '50% 50%'
                },
                angry: {
                    video: getVideoPath('male', 'angry'),
                    animation: 'breathing',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                surprised: {
                    video: getVideoPath('male', 'surprised'),
                    animation: 'quick-bounce',
                    scale: 1.05,
                    transformOrigin: '50% 50%'
                },
                scared: {
                    video: getVideoPath('male', 'scared'),
                    animation: 'slow-pulse',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                excited: {
                    video: getVideoPath('male', 'excited'),
                    animation: 'gentle-bounce',
                    scale: 1.1,
                    transformOrigin: '50% 50%'
                },
                sad: {
                    video: getVideoPath('male', 'sad'),
                    animation: 'slow-pulse',
                    scale: 0.98,
                    transformOrigin: '50% 50%'
                },
                curious: {
                    video: getVideoPath('male', 'curious'),
                    animation: 'thoughtful-nod',
                    scale: 1.0,
                    transformOrigin: '50% 50%'
                },
                laugh: {
                    video: getVideoPath('male', 'laugh'),
                    animation: 'gentle-bounce',
                    scale: 1.1,
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
                'Dr. Elara': {
                    position: {
                        scale: 1.8,
                        x: '-25%',
                        y: '10%'
                    },
                    emotion: 'neutral'
                }
            }
        }
    },

    animations: {
        'breathing': {
            keyframes: `@keyframes breathing { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }`,
            style: { animation: 'breathing 3s ease-in-out infinite' }
        },
        'gentle-bounce': {
            keyframes: `@keyframes gentleBounce { 0%, 100% { transform: translateY(0px) scale(1.1); } 50% { transform: translateY(-8px) scale(1.12); } }`,
            style: { animation: 'gentleBounce 4s ease-in-out infinite' }
        },
        'slow-pulse': {
            keyframes: `@keyframes slowPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.9; transform: scale(0.98); } }`,
            style: { animation: 'slowPulse 5s ease-in-out infinite' }
        },
        'thoughtful-nod': {
            keyframes: `@keyframes thoughtfulNod { 0%, 100% { transform: rotateZ(0deg) scale(1); } 25% { transform: rotateZ(-1deg) scale(1.01); } 75% { transform: rotateZ(1deg) scale(1.01); } }`,
            style: { animation: 'thoughtfulNod 6s ease-in-out infinite' }
        },
        'quick-bounce': {
            keyframes: `@keyframes quickBounce { 0%, 100% { transform: scale(1.05) translateY(0px); } 50% { transform: scale(1.08) translateY(-5px); } }`,
            style: { animation: 'quickBounce 2s ease-in-out infinite' }
        },
        'firm-nod': {
            keyframes: `@keyframes firmNod { 0%, 100% { transform: scale(1.05) translateY(0px); } 50% { transform: scale(1.05) translateY(-3px); } }`,
            style: { animation: 'firmNod 3s ease-in-out infinite' }
        },
        'confident-sway': {
            keyframes: `@keyframes confidentSway { 0%, 100% { transform: rotateZ(0deg) scale(1.1); } 33% { transform: rotateZ(-0.5deg) scale(1.1); } 66% { transform: rotateZ(0.5deg) scale(1.1); } }`,
            style: { animation: 'confidentSway 8s ease-in-out infinite' }
        },
        'still': {
            keyframes: ``,
            style: {}
        }
    }
};

// FIXED: Improved getAvatarConfig with better emotion mapping
export const getAvatarConfig = (persona, emotion) => {
    // Handle missing or invalid persona
    if (!persona || !avatarManifest.personas[persona]) {
        return getDefaultConfig();
    }

    const personaData = avatarManifest.personas[persona];

    // If emotion is a string that might contain actions, extract the emotion
    if (emotion && typeof emotion === 'string') {
        const extractedEmotion = extractEmotionFromText(emotion);
        emotion = extractedEmotion;
    }

    // Handle missing or invalid emotion
    if (!emotion || typeof emotion !== 'string') {
        emotion = personaData.defaultEmotion;
    }

    emotion = emotion.toLowerCase();

    // Map emotion to standardized version
    const emotionMapping = {
        // Sad variants
        'sad': 'sad',
        'frown': 'sad',
        'frowning': 'sad',
        'cry': 'sad',
        'crying': 'sad',
        'down': 'sad',
        'depressed': 'sad',
        'unhappy': 'sad',
        'heartbroken': 'sad',

        // Joyful variants
        'joyful': 'joyful',
        'happy': 'joyful',
        'laugh': 'joyful',
        'giggle': 'joyful',
        'laughing': 'joyful',
        'chuckle': 'joyful',
        'delighted': 'joyful',
        'pleased': 'joyful',
        'overjoyed': 'joyful',

        // Excited variants
        'excited': 'excited',
        'excitement': 'excited',
        'bounce': 'excited',
        'bouncing': 'excited',
        'thrilled': 'excited',
        'woohoo': 'excited',
        'yay': 'excited',
        'yippee': 'excited',

        // Surprised variants
        'surprised': 'surprised',
        'surprise': 'surprised',
        'shocked': 'surprised',
        'shock': 'surprised',
        'gasp': 'surprised',
        'wow': 'surprised',
        'astonished': 'surprised',
        'amazed': 'surprised',

        // Thoughtful variants
        'thoughtful': 'thoughtful',
        'thinking': 'thoughtful',
        'ponder': 'thoughtful',
        'consider': 'thoughtful',
        'contemplative': 'thoughtful',

        // Smile variants
        'smile': 'smile',
        'smiling': 'smile',
        'grin': 'smile',
        'grinning': 'smile',
        'warmly': 'smile',

        // Concerned variants
        'concerned': 'concerned',
        'worried': 'concerned',
        'anxious': 'concerned',
        'trouble': 'concerned',
        'nervous': 'concerned',

        // Angry variants
        'angry': 'angry',
        'mad': 'angry',
        'furious': 'angry',
        'rage': 'angry',

        // Scared variants
        'scared': 'scared',
        'afraid': 'scared',
        'fear': 'scared',
        'fearful': 'scared',
        'terrified': 'scared',

        // Explain variants
        'explain': 'explain',
        'explaining': 'explain',
        'explains': 'explain',

        // Curious variants
        'curious': 'curious',
        'intrigued': 'curious',
        'fascinated': 'curious',
        'interested': 'curious',

        // Empathetic variants
        'empathetic': 'empathetic',
        'empathy': 'empathetic',
        'compassionate': 'empathetic',
        'understanding': 'empathetic',
        'sympathetic': 'empathetic',

        // Neutral variants
        'neutral': 'neutral',
        'calm': 'neutral',
        'normal': 'neutral',
        'peaceful': 'neutral',
        'relaxed': 'neutral'
    };

    // Get the standardized emotion
    const standardizedEmotion = emotionMapping[emotion] || emotion;

    // Try to get emotion data, fallback to default
    let emotionData = personaData.emotions[standardizedEmotion];

    // If emotion not found, use default emotion
    if (!emotionData) {
        emotion = personaData.defaultEmotion;
        emotionData = personaData.emotions[personaData.defaultEmotion];
    }

    // Get animation configuration
    const animation = emotionData.animation
        ? (avatarManifest.animations[emotionData.animation] || avatarManifest.animations.breathing)
        : avatarManifest.animations.breathing;

    return {
        image: emotionData.image || null,
        video: emotionData.video,
        animation: emotionData.animation || 'breathing',
        style: {
            transform: `scale(${emotionData.scale || 1.0})`,
            transformOrigin: emotionData.transformOrigin || '50% 50%',
            ...animation.style
        },
        keyframes: animation.keyframes,
        gender: personaData.gender,
        emotion: standardizedEmotion // Return the actual emotion used
    };
};

const getDefaultConfig = () => ({
    image: '/images/avatar/fallback.png',
    video: '/videos/avatar/Content_Healthcare_Pro_Teal_Scrubs - TRIM - Videobolt.net.mp4',
    animation: 'breathing',
    style: avatarManifest.animations.breathing.style,
    keyframes: avatarManifest.animations.breathing.keyframes,
    gender: 'female',
    emotion: 'neutral'
});

export const getPersonaByVoice = (voice) => {
    if (!voice || typeof voice !== 'string') {
        return 'Dr. Elara'; // Default persona
    }

    const gender = voiceGenderMap[voice.toLowerCase()];
    return gender === 'male' ? 'Dr. Theo' : 'Dr. Elara';
};

export const getAvailablePersonas = () => Object.keys(avatarManifest.personas);

export const getPersonasByGender = (gender) => {
    if (!gender || (gender !== 'male' && gender !== 'female')) {
        return Object.keys(avatarManifest.personas);
    }

    return Object.keys(avatarManifest.personas).filter(
        persona => avatarManifest.personas[persona].gender === gender
    );
};

// UPDATED: Enhanced emotionAliases with context-aware keywords
export const emotionAliases = {
    // Basic emotions
    'smile': 'smile', 'smiles': 'smile', 'smiling': 'smile', 'grin': 'smile', 'grinning': 'smile',
    'laugh': 'joyful', 'laughs': 'joyful', 'laughing': 'joyful', 'chuckle': 'joyful', 'chuckles': 'joyful', 'giggle': 'joyful',
    'concerned': 'concerned', 'concern': 'concerned', 'worried': 'concerned', 'worry': 'concerned', 'anxious': 'concerned', 'nervous': 'concerned',
    'empathetic': 'empathetic', 'empathy': 'empathetic', 'compassionate': 'empathetic', 'understanding': 'empathetic',
    'sad': 'sad', 'sadly': 'sad', 'unhappy': 'sad', 'heartbroken': 'sad', 'cry': 'sad', 'frown': 'sad', 'frowning': 'sad', 'down': 'sad', 'depressed': 'sad',
    'thoughtful': 'thoughtful', 'thinking': 'thoughtful', 'ponder': 'thoughtful', 'consider': 'thoughtful',
    'curious': 'curious', 'intrigued': 'curious', 'fascinated': 'curious', 'interested': 'curious',
    'surprised': 'surprised', 'surprise': 'surprised', 'shocked': 'surprised', 'shock': 'surprised', 'gasp': 'surprised', 'gasped': 'surprised', 'wow': 'surprised', 'astonished': 'surprised',
    'angry': 'angry', 'mad': 'angry', 'furious': 'angry', 'rage': 'angry',
    'scared': 'scared', 'afraid': 'scared', 'fear': 'scared', 'fearful': 'scared', 'terrified': 'scared',
    'disgust': 'revulsed', 'revulsed': 'revulsed',
    'explain': 'explain', 'explaining': 'explain', 'explains': 'explain',
    'excited': 'excited', 'thrilled': 'excited', 'excitement': 'excited', 'squeal': 'excited',
    'bounces': 'excited', 'bounce': 'excited', 'bouncing': 'excited', 'bounced': 'excited',
    'woohoo': 'excited', 'yay': 'excited', 'yippee': 'excited', 'wow': 'excited',
    'happy': 'joyful', 'delighted': 'joyful', 'pleased': 'joyful', 'overjoyed': 'joyful',

    // Trauma and serious context - ADDED FOR BETTER CONTEXT AWARENESS
    'ptsd': 'empathetic', 'trauma': 'empathetic', 'traumatic': 'empathetic',
    'abuse': 'concerned', 'abusive': 'concerned', 'abused': 'concerned',
    'betray': 'sad', 'betrayal': 'sad', 'betrayed': 'sad',
    'family': 'concerned', 'families': 'concerned',
    'uncle': 'concerned', 'relative': 'concerned', 'relatives': 'concerned',
    'police': 'shocked', 'cops': 'shocked', 'law': 'concerned',
    'charge': 'shocked', 'charges': 'shocked', 'legal': 'concerned',
    'assault': 'angry', 'assaulted': 'angry', 'violence': 'angry',
    'thief': 'angry', 'steal': 'angry', 'stolen': 'angry', 'theft': 'angry',
    'manipulate': 'concerned', 'manipulation': 'concerned', 'manipulative': 'concerned',
    'victim': 'empathetic', 'victims': 'empathetic', 'victimized': 'empathetic',
    'hurt': 'sad', 'hurting': 'sad', 'hurtful': 'sad',
    'pain': 'sad', 'painful': 'sad',
    'safe': 'empathetic', 'safety': 'empathetic',
    'trust': 'thoughtful', 'trusted': 'thoughtful', 'trusting': 'thoughtful',

    // Affectionate actions
    'hug': 'smile', 'hugs': 'smile', 'hugging': 'smile', 'hugged': 'smile',
    'embrace': 'smile', 'embraces': 'smile', 'embracing': 'smile', 'embraced': 'smile',
    'pat': 'smile', 'pats': 'smile', 'patting': 'smile', 'patted': 'smile',
    'comfort': 'empathetic', 'comforting': 'empathetic', 'comforted': 'empathetic',
    'reassure': 'empathetic', 'reassuring': 'empathetic', 'reassured': 'empathetic',

    // Neutral/calm states
    'calm': 'neutral', 'calmly': 'neutral', 'peaceful': 'neutral', 'relaxed': 'neutral',
    'neutral': 'neutral', 'normal': 'neutral',

    // Additional expressions
    'pout': 'sad', 'pouting': 'sad',
    'sigh': 'thoughtful', 'sighed': 'thoughtful', 'sighing': 'thoughtful',
    'whisper': 'thoughtful', 'whispered': 'thoughtful', 'whispering': 'thoughtful'
};

// NEW: Action-to-emotion mapping for actions within asterisks
export const actionEmotionMap = {
    // Excitement-related actions
    '*squeal*': 'excited',
    '*squeal of excitement*': 'excited',
    '*squeals*': 'excited',
    '*bounces*': 'excited',
    '*bounce*': 'excited',
    '*bouncing*': 'excited',
    '*bounces up and down*': 'excited',
    '*bouncing up and down*': 'excited',
    '*bouncing up and down with excitement*': 'excited',
    '*jumps*': 'excited',
    '*jump*': 'excited',
    '*jumping*': 'excited',
    '*claps*': 'excited',
    '*clap*': 'excited',
    '*clapping*': 'excited',

    // Surprise/shock actions
    '*gasp*': 'surprised',
    '*gasps*': 'surprised',
    '*gasping*': 'surprised',
    '*shocked*': 'surprised',
    '*shocking*': 'surprised',
    '*dropping jaw in shock*': 'surprised',
    '*jaw drop*': 'surprised',
    '*jaw drops*': 'surprised',

    // Sad actions
    '*cries*': 'sad',
    '*cry*': 'sad',
    '*crying*': 'sad',
    '*sob*': 'sad',
    '*sobs*': 'sad',
    '*sobbing*': 'sad',
    '*frown*': 'sad',
    '*frowning*': 'sad',
    '*pout*': 'sad',
    '*pouting*': 'sad',

    // Thoughtful actions
    '*thinks*': 'thoughtful',
    '*think*': 'thoughtful',
    '*thinking*': 'thoughtful',
    '*ponders*': 'thoughtful',
    '*ponder*': 'thoughtful',
    '*pondering*': 'thoughtful',
    '*sigh*': 'thoughtful',
    '*sighs*': 'thoughtful',
    '*sighing*': 'thoughtful',

    // Smile/happy actions
    '*smiles*': 'smile',
    '*smile*': 'smile',
    '*smiling*': 'smile',
    '*grins*': 'smile',
    '*grin*': 'smile',
    '*grinning*': 'smile',
    '*laughs*': 'joyful',
    '*laugh*': 'joyful',
    '*laughing*': 'joyful',
    '*chuckles*': 'joyful',
    '*chuckle*': 'joyful',
    '*chuckling*': 'joyful',
    '*giggles*': 'joyful',
    '*giggle*': 'joyful',
    '*giggling*': 'joyful',
    '*nervous smile*': 'smile',

    // Hug/affection actions
    '*hug*': 'smile',
    '*hugs*': 'smile',
    '*hugging*': 'smile',
    '*hugged*': 'smile',
    '*embrace*': 'smile',
    '*embraces*': 'smile',
    '*embracing*': 'smile',
    '*embraced*': 'smile',

    // Concerned actions
    '*worries*': 'concerned',
    '*worry*': 'concerned',
    '*worrying*': 'concerned',
    '*worried*': 'concerned',

    // Angry actions
    '*angry*': 'angry',
    '*angers*': 'angry',
    '*angered*': 'angry',
    '*angering*': 'angry',
    '*furious*': 'angry',
    '*fumes*': 'angry',
    '*fuming*': 'angry',

    // Scared actions
    '*scared*': 'scared',
    '*scares*': 'scared',
    '*scaring*': 'scared',
    '*afraid*': 'scared',
    '*fear*': 'scared',
    '*fears*': 'scared',
    '*fearing*': 'fearful',

    // Explain actions
    '*explains*': 'explain',
    '*explain*': 'explain',
    '*explaining*': 'explain',
    '*explained*': 'explain',

    // Curious actions
    '*curious*': 'curious',
    '*curiously*': 'curious',
    '*intrigued*': 'curious',
    '*fascinated*': 'curious',

    // Context-aware actions for serious topics
    '*listening carefully*': 'thoughtful',
    '*taking notes*': 'thoughtful',
    '*leaning forward*': 'concerned',
    '*nodding empathetically*': 'empathetic',
    '*making eye contact*': 'empathetic',
    '*speaking softly*': 'empathetic',
    '*taking a deep breath*': 'thoughtful',
    '*checking notes*': 'thoughtful'
};

// UPDATED: Function to extract emotion from text with context awareness
export const extractEmotionFromText = (text, context = '') => {
    if (!text || typeof text !== 'string') return 'neutral';

    const lowerText = text.toLowerCase();
    const fullContext = (context + ' ' + lowerText).toLowerCase();

    // Priority 1: Check for trauma-related keywords in full context
    if (fullContext.includes('ptsd') || fullContext.includes('trauma') || fullContext.includes('traumatic')) {
        return 'empathetic';
    }
    if (fullContext.includes('abuse') || fullContext.includes('abusive') || fullContext.includes('assault')) {
        return 'concerned';
    }
    if (fullContext.includes('family') && (fullContext.includes('betray') || fullContext.includes('uncle'))) {
        return 'sad';
    }
    if (fullContext.includes('police') || fullContext.includes('charge') || fullContext.includes('legal')) {
        return 'shocked';
    }
    if (fullContext.includes('thief') || fullContext.includes('steal') || fullContext.includes('theft')) {
        return 'angry';
    }
    if (fullContext.includes('victim') || fullContext.includes('hurt') || fullContext.includes('pain')) {
        return 'empathetic';
    }
    if (fullContext.includes('manipulate') || fullContext.includes('manipulation')) {
        return 'concerned';
    }

    // Priority 2: Check for exact action matches within asterisks
    const asteriskRegex = /\*([^*]+)\*/g;
    let match;
    const actions = [];

    while ((match = asteriskRegex.exec(lowerText)) !== null) {
        actions.push(match[1]);
    }

    // Check each action against our actionEmotionMap
    for (const action of actions) {
        const fullAction = `*${action}*`;
        if (actionEmotionMap[fullAction]) {
            return actionEmotionMap[fullAction];
        }

        // Also check partial matches for action words
        const actionWords = action.split(' ');
        for (const word of actionWords) {
            const partialAction = `*${word}*`;
            if (actionEmotionMap[partialAction]) {
                return actionEmotionMap[partialAction];
            }
        }
    }

    // Priority 3: Check the text for emotion keywords
    for (const [keyword, emotion] of Object.entries(emotionAliases)) {
        if (lowerText.includes(keyword)) {
            return emotion;
        }
    }

    // Priority 4: Check for exclamation patterns that might indicate excitement
    if (lowerText.includes('oh my stars') || lowerText.includes('woohoo') ||
        lowerText.includes('yay') || lowerText.includes('yippee') ||
        lowerText.includes('wow') || lowerText.includes('oh my goodness') ||
        lowerText.includes('oh my gosh')) {
        return 'excited';
    }

    // Priority 5: Check for surprised patterns
    if (lowerText.includes('what the') || lowerText.includes('no way') ||
        lowerText.includes('whoa') || lowerText.includes('oh my')) {
        return 'surprised';
    }

    // Priority 6: Default to thoughtful for questions, neutral for statements
    if (lowerText.includes('?') || lowerText.includes('can you') || lowerText.includes('what is')) {
        return 'thoughtful';
    }

    return 'neutral';
};

export const apiConfig = {
    gemini: {
        key: GEMINI_API_KEY,
        url: CHAT_BRAIN_API_URL
    },
    elevenLabs: {
        key: ELEVENLABS_API_KEY,
        urlPrefix: ELEVENLABS_API_URL_PREFIX
    }
};

// Simple validation function
export const validateVideoPaths = () => {
    const errors = [];

    // Check that all video references in avatarManifest exist in videoPathMap
    for (const [personaName, personaData] of Object.entries(avatarManifest.personas)) {
        for (const [emotionName, emotionData] of Object.entries(personaData.emotions)) {
            if (emotionData.video) {
                const videoPath = emotionData.video;
                // Extract filename from path
                const fileName = videoPath.split('/').pop();

                // Check if this filename exists in any videoPathMap value
                const exists = Object.values(videoPathMap).some(videoFile =>
                    videoFile === fileName ||
                    `/videos/avatar/${videoFile}` === videoPath
                );

                if (!exists) {
                    errors.push(`Missing video for ${personaName}.${emotionName}: ${fileName}`);
                }
            }
        }
    }

    if (errors.length > 0) {
        console.warn('Video path validation warnings:', errors);
        return false;
    }

    return true;
};

// Run validation on import
validateVideoPaths();