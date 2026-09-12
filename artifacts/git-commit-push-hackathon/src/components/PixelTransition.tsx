import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  once?: boolean;
  animationStepDuration?: number;
  className?: string;
}

export default function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 10,
  pixelColor = '#b990ff',
  animationStepDuration = 0.5,
  className = '',
}: PixelTransitionProps) {
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    // Start transition automatically on mount
    const timer = setTimeout(() => setShowSecond(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalPixels = gridSize * gridSize;
  const pixels = Array.from({ length: totalPixels }, (_, i) => i);

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      {/* First Content */}
      <AnimatePresence>
        {!showSecond && (
          <motion.div
            className="absolute inset-0 z-10"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {firstContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pixel Grid Overlay */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        <AnimatePresence>
          {showSecond && pixels.map((index) => {
            const delay = Math.random() * animationStepDuration;
            return (
              <motion.div
                key={index}
                className="w-full h-full"
                style={{ backgroundColor: pixelColor }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 0 }}
                transition={{ duration: animationStepDuration, delay, ease: "easeOut" }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Second Content */}
      <div className="relative z-0 w-full h-full">
        {secondContent}
      </div>
    </div>
  );
}
