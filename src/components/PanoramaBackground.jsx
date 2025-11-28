import { useEffect, useRef } from 'react';

const PanoramaBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let img = containerRef.current.querySelector('img');
    if (!img) return;
    let handle = (e) => {
      const { clientX, clientY } = e;
      const { width, height } = containerRef.current.getBoundingClientRect();
      // Calculate percent offset
      const xPercent = clientX / width;
      const yPercent = clientY / height;
      // Move image horizontally (simulate 360 effect)
      img.style.objectPosition = `${xPercent * 100}% ${yPercent * 50 + 25}%`;
    };
    containerRef.current.addEventListener('mousemove', handle);
    return () => {
      containerRef.current.removeEventListener('mousemove', handle);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      <img
        src="/images/background/sunset-3.jpg"
        alt="360 Panorama Background"
        style={{
          width: '200vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: '50% 50%',
          transition: 'object-position 0.2s',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
};

export default PanoramaBackground;
