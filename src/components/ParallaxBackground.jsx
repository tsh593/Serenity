// src/components/ParallaxBackground.jsx
import React, { useEffect, useRef } from 'react';
import '../styles/ParallaxBackground.css';


const ParallaxBackground = () => {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!backgroundRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage
      const x = (clientX / innerWidth) * 100;
      const y = (clientY / innerHeight) * 100;
      
      // Very subtle movement (2% max shift)
      const moveX = (x - 50) * 0.02;
      const moveY = (y - 50) * 0.02;
      
      // Apply transform with smooth transition
      backgroundRef.current.style.transform = `translate(${moveX}%, ${moveY}%) scale(1.02)`;
    };

    // Only add listener if user prefers reduced motion is false
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="parallax-background">
      <div ref={backgroundRef} className="background-content">
        {/* Subtle gradient overlay */}
        <div className="gradient-overlay"></div>
      </div>
    </div>
  );
};

export default ParallaxBackground;