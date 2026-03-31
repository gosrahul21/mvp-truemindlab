'use client'
import {motion, useMotionValue} from 'framer-motion';
import { MagneticButtonProps } from './framer-utils';
import { ReactElement, useRef } from 'react';

export function MagneticButton({
    children,
    className = '',
    style,
    strength = 0.4,
    radius = 100,
    onClick,
  }: MagneticButtonProps): ReactElement {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
  
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ref.current) return;
  
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
  
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
  
      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
  
      if (distance < radius) {
        x.set(mouseX * strength);
        y.set(mouseY * strength);
      }
    };
  
    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };
  
    return (
      <motion.button
        ref={ref}
        className={className}
        style={{
          x,
          y,
          ...style,
        }}
        animate={{
          x,
          y,
        } as never}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.5,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.button>
    );
  }