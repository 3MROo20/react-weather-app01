
import React, { useEffect } from 'react';
import { invalidate, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useAppStore } from './stores';

export default function CameraAnimation() {
  const { camera } = useThree();
  const progress = useAppStore((s) => s.progress);
  const globalClick = useAppStore((s) => s.globalClick);

  useEffect(() => {

      if (progress === 100 && globalClick) {
          const tl = gsap.fromTo(
              camera.position,
        { x: -20, y: 15, z: 35 },
        {
          delay: 0.95,
          x: 0,
          y: 3,
          z: 15,
          duration: 13,
          ease: 'power1.inOut',
          onUpdate: () => invalidate(),
        }
    );
    
    return () => tl.kill();
}


}, [camera, progress, globalClick]);

  return null;
}
