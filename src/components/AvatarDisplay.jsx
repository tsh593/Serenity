// src/components/AvatarDisplay.jsx - SAFETY FIX VERSION
import React, { useState, useEffect, useRef } from 'react';
import { getAvatarConfig } from '../config/avatarConfig';
import '../styles/AvatarDisplay.css';

const AvatarDisplay = ({ 
  persona = 'Dr. Elara', 
  emotion = 'neutral', 
  isSpeaking = false, 
  forceVideo = false,
  isLoading = false
}) => {
  const [avatarConfig, setAvatarConfig] = useState(null);
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Priority logic
  const finalEmotion = (isLoading && !isSpeaking) ? 'thoughtful' : emotion;

  // Load avatar configuration
  useEffect(() => {
    const config = getAvatarConfig(persona, finalEmotion);
    setAvatarConfig(config);
    setVideoError(false);
    setImageError(false);
  }, [persona, finalEmotion, forceVideo, isSpeaking, isLoading]);

  // Handle video playback SAFELY
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !avatarConfig?.video || !forceVideo) return;

    let isMounted = true;

    const playVideo = async () => {
      try {
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        
        video.load();
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Video started successfully
            })
            .catch(error => {
              // Ignore AbortError which happens when emotions switch fast
              if (isMounted && error.name !== 'AbortError') {
                console.warn('⚠️ Video play interrupted (harmless):', error.message);
                // Only set error if it's a real loading error, not an interruption
                if (error.name === 'NotSupportedError' || error.name === 'NotAllowedError') {
                   setVideoError(true);
                }
              }
            });
        }
      } catch (error) {
        console.warn('❌ Video setup failed:', error);
        if (isMounted) setVideoError(true);
      }
    };

    playVideo();

    return () => { isMounted = false; };
  }, [avatarConfig?.video, forceVideo]); 

  if (!avatarConfig) {
    return <div className="avatar-display loading">Loading...</div>;
  }

  const shouldShowVideo = avatarConfig.video && forceVideo && !videoError;
  const shouldShowImage = avatarConfig.image && !forceVideo && !imageError;

  return (
    <div className="avatar-display">
      {avatarConfig.keyframes && <style>{avatarConfig.keyframes}</style>}
      
      <div 
        className={`avatar-container ${finalEmotion} ${isSpeaking ? 'speaking' : ''} ${avatarConfig.gender || 'female'}`}
        style={avatarConfig.style}
      >
        {shouldShowVideo && (
          <video
            ref={videoRef}
            className="avatar-video"
            key={`video-${persona}-${finalEmotion}`}
            src={avatarConfig.video}
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
          />
        )}
        
        {shouldShowImage && (
          <img
            className="avatar-image"
            src={avatarConfig.image}
            key={`image-${persona}-${finalEmotion}`}
            alt={`${persona} - ${finalEmotion}`}
            onError={() => setImageError(true)}
          />
        )}
        
        {!shouldShowVideo && !shouldShowImage && (
          <div className="avatar-fallback">
            <div className="fallback-emoji">
              {avatarConfig.gender === 'male' ? '👨‍⚕️' : '👩‍⚕️'}
            </div>
            <div className="fallback-text">{persona} - {finalEmotion}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarDisplay;