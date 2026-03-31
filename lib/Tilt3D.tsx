
import { motion, useMotionValue } from 'framer-motion';
import { ReactElement, useRef } from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  speed?: number;
  perspective?: number;
}

export function Tilt3D({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  speed = 400,
  perspective = 1000,
}: Tilt3DProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = width / 2;
    const centerY = height / 2;

    const rotateX = ((mouseY - centerY) / centerY) * -maxTilt;
    const rotateY = ((mouseX - centerX) / centerX) * maxTilt;

    x.set(rotateY);
    y.set(rotateX);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: `${perspective}px` }}>
      <motion.div
        ref={ref}
        className={className}
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: y,
          rotateY: x,
          scale,
        } as never}
        transition={{
          type: 'spring',
          stiffness: speed,
          damping: 30,
          mass: 0.5,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </motion.div>
    </div>
  );
}
  