// src/components/VideoBackground.jsx - UPDATED
import React, { useRef, useEffect, useState } from 'react';
import '../styles/VideoBackground.css';

const VideoBackground = () => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 VideoBackground: Attempting to load video...');

    const handleCanPlay = () => {
      console.log('✅ Video can play');
      setVideoLoaded(true);
      video.play().catch(error => {
        console.warn('❌ Auto-play failed:', error);
      });
    };

    const handleError = (e) => {
      console.error('❌ Video error:', e);
      setVideoError(true);
    };

    const handleLoadStart = () => {
      console.log('📥 Video load started');
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // Try to play the video
    video.play().catch(error => {
      console.log('ℹ️ Auto-play prevented (normal in some browsers):', error);
    });

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, []);

  return (
    <div className="video-background">
      {!videoError ? (
        <video
          ref={videoRef}
          className={`background-video ${videoLoaded ? 'loaded' : 'loading'}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          {/* Try multiple video sources */}
          <source src="/videos/sea waves.mp4" type="video/mp4" />
          <source src="/videos/sea-waves.mp4" type="video/mp4" />
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="video-fallback">
          {/* Fallback will be hidden by your ChatPage.css background */}
          <div className="fallback-gradient"></div>
        </div>
      )}
      <div className="video-overlay"></div>
    </div>
  );
};

export default VideoBackground;