import { useEffect, useRef } from 'react';
import { Viewer } from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';

const PhotoSphereBackground = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!viewerRef.current) return;
    // Create the viewer
    const viewer = new Viewer({
      container: viewerRef.current,
      panorama: '/images/background/sunset-4.png',
      mousewheel: false,
      navbar: false,
      loadingImg: null,
      size: {
        width: '100vw',
        height: '100vh',
      },
      useXmpData: false,
      moveSpeed: 1,
      minFov: 50,
      maxFov: 90,
      fisheye: false,
    });
    // Prevent interaction with the viewer (background only)
    viewer.container.style.pointerEvents = 'none';
    return () => {
      viewer.destroy();
    };
  }, []);

  return (
    <div
      ref={viewerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
      }}
    />
  );
};

export default PhotoSphereBackground;
