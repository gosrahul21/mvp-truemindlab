'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: .5,
      easing: (t) => Math.min(.5, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
