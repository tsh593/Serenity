// // This is your "database" for avatar personas, emotions, and animations
// export const avatarManifest = {
//   personas: {
//     'Dr. Elara': {
//       description: 'A compassionate doctor with a warm demeanor',
//       emotions: {
//                 scared: { // synonym for fearful
//                   video: '/videos/avatar/Fearful_Medic_Emergency_Room - TRIM - Videobolt.net.mp4',
//                   animation: 'slow-pulse',
//                   scale: 1.0,
//                   transformOrigin: '50% 50%'
//                 },
//         neutral: { 
//           image: '/images/avatar/elara_neutral.png',
//           video: '/videos/avatar/Content_Healthcare_Pro_Teal_Scrubs - TRIM - Videobolt.net.mp4',
//           animation: 'breathing',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         },
//         joyful: { 
//           image: '/images/avatar/elara_joyful.png',
//           video: '/videos/avatar/Joyful_Nurse_Talking_Radiant - TRIM - Videobolt.net.mp4',
//           animation: 'gentle-bounce',
//           scale: 1.1,
//           transformOrigin: '50% 50%'
//         },
//         concerned: { 
//           image: '/images/avatar/elara_concerned.png',
//           video: '/videos/avatar/Anxious_Healthcare_Worker_Hallway - TRIM - Videobolt.net.mp4',
//           animation: 'slow-pulse',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         },
//         thoughtful: { 
//           image: '/images/avatar/elara_thoughtful.png',
//           video: '/videos/avatar/Empathetic_Clinician_Explains_Medical_Info - TRIM - Videobolt.net.mp4',
//           animation: 'thoughtful-nod',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         },
//         explain: {
//           video: '/videos/avatar/Animated_Navy_Medic_Explains - TRIM - Videobolt.net.mp4',
//           animation: 'breathing',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         },
//         smile: {
//           video: '/videos/avatar/Smiling_Nurse_Confident_Professional - TRIM - Videobolt.net.mp4',
//           animation: 'breathing',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         },
//         excited: {
//           video: '/videos/avatar/Excited_Pediatrician_Good_News - TRIM - Videobolt.net.mp4',
//           animation: 'breathing',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         },
//         sad: {
//           video: '/videos/avatar/Sad_Healthcare_Worker_Hospital_Setting - TRIM - Videobolt.net.mp4',
//           animation: 'breathing',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         },
//         revulsed: {
//           video: '/videos/avatar/Revulsed_Healthcare_Worker_Discussion.mp4',
//           animation: 'breathing',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         },
//         angry: {
//           video: '/videos/avatar/Angry_Scrub_Professional - TRIM - Videobolt.net.mp4',
//           animation: 'breathing',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         },
//         surprised: { 
//           video: '/videos/avatar/elara_surprised.mp4',
//           animation: 'quick-bounce',
//           scale: 1.05,
//           transformOrigin: '50% 50%'
//         },
//         shocked: { // synonym for surprised
//           video: '/videos/avatar/elara_surprised.mp4',
//           animation: 'quick-bounce',
//           scale: 1.05,
//           transformOrigin: '50% 50%'
//         },
//         fearful: {
//           video: '/videos/avatar/Fearful_Medic_Emergency_Room - TRIM - Videobolt.net.mp4',
//           animation: 'slow-pulse',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         }
//       },
//       defaultEmotion: 'neutral'
//     },
//     'Commander Ben': {
//       description: 'A confident military leader with sharp instincts',
//       emotions: {
//         neutral: { 
//           image: '/images/avatar/ben_neutral.png',
//           animation: 'breathing',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         },
//         determined: { 
//           image: '/images/avatar/ben_determined.png',
//           animation: 'firm-nod',
//           scale: 1.05,
//           transformOrigin: '50% 50%'
//         },
//         smiling: { 
//           image: '/images/avatar/ben_smiling.png',
//           animation: 'confident-sway',
//           scale: 1.1,
//           transformOrigin: '50% 50%'
//         },
//         serious: { 
//           image: '/images/avatar/ben_serious.png',
//           animation: 'still',
//           scale: 1.0,
//           transformOrigin: '50% 50%'
//         }
//       },
//       defaultEmotion: 'neutral'
//     }
//   },
  
//   // Multi-persona scenes (like your clinic video)
//   scenes: {
//     'clinic_intro': {
//       video: '/videos/clinic_intro.mp4',
//       personas: {
//         'Dr. Elara': {
//           position: { scale: 1.8, x: '-25%', y: '10%' },
//           emotion: 'neutral'
//         },
//         'Commander Ben': {
//           position: { scale: 1.6, x: '25%', y: '5%' },
//           emotion: 'serious'
//         }
//       }
//     }
//   },
  
//   // Available animations for the avatar images
//   animations: {
//     'breathing': {
//       keyframes: `
//         @keyframes breathing {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.02); }
//         }
//       `,
//       style: {
//         animation: 'breathing 3s ease-in-out infinite'
//       }
//     },
//     'gentle-bounce': {
//       keyframes: `
//         @keyframes gentleBounce {
//           0%, 100% { transform: translateY(0px) scale(1.1); }
//           50% { transform: translateY(-8px) scale(1.12); }
//         }
//       `,
//       style: {
//         animation: 'gentleBounce 4s ease-in-out infinite'
//       }
//     },
//     'slow-pulse': {
//       keyframes: `
//         @keyframes slowPulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.9; transform: scale(0.98); }
//         }
//       `,
//       style: {
//         animation: 'slowPulse 5s ease-in-out infinite'
//       }
//     },
//     'thoughtful-nod': {
//       keyframes: `
//         @keyframes thoughtfulNod {
//           0%, 100% { transform: rotateZ(0deg) scale(1); }
//           25% { transform: rotateZ(-1deg) scale(1.01); }
//           75% { transform: rotateZ(1deg) scale(1.01); }
//         }
//       `,
//       style: {
//         animation: 'thoughtfulNod 6s ease-in-out infinite'
//       }
//     },
//     'quick-bounce': {
//       keyframes: `
//         @keyframes quickBounce {
//           0%, 100% { transform: scale(1.05) translateY(0px); }
//           50% { transform: scale(1.08) translateY(-5px); }
//         }
//       `,
//       style: {
//         animation: 'quickBounce 2s ease-in-out infinite'
//       }
//     },
//     'firm-nod': {
//       keyframes: `
//         @keyframes firmNod {
//           0%, 100% { transform: scale(1.05) translateY(0px); }
//           50% { transform: scale(1.05) translateY(-3px); }
//         }
//       `,
//       style: {
//         animation: 'firmNod 3s ease-in-out infinite'
//       }
//     },
//     'confident-sway': {
//       keyframes: `
//         @keyframes confidentSway {
//           0%, 100% { transform: rotateZ(0deg) scale(1.1); }
//           33% { transform: rotateZ(-0.5deg) scale(1.1); }
//           66% { transform: rotateZ(0.5deg) scale(1.1); }
//         }
//       `,
//       style: {
//         animation: 'confidentSway 8s ease-in-out infinite'
//       }
//     },
//     'still': {
//       keyframes: ``,
//       style: {}
//     }
//   }
// }

// // Helper function to get avatar configuration
// export const getAvatarConfig = (persona, emotion) => {
//   const personaData = avatarManifest.personas[persona];
//   if (!personaData) return null;
  
//   const emotionData = personaData.emotions[emotion] || personaData.emotions[personaData.defaultEmotion];
//   const animation = avatarManifest.animations[emotionData.animation];
  
//   return {
//     image: emotionData.image,
//     video: emotionData.video,
//     animation: emotionData.animation,
//     style: {
//       transform: `scale(${emotionData.scale})`,
//       transformOrigin: emotionData.transformOrigin,
//       ...animation.style
//     },
//     keyframes: animation.keyframes
//   };
// }