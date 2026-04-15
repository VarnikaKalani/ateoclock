"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

// Seeded pseudo-random number generator
class SeededRandom {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

interface ImageData {
  src: string;
  alt: string;
  id: string;
}

interface ScatterPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface ImageStackProps {
  images?: ImageData[];
  maxRotation?: number;
  scatterRadius?: number;
  seed?: number;
  className?: string;
  onReshuffle?: () => void;
}

export interface ImageStackRef {
  reshuffle: () => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0,
      staggerChildren: 1.5,
    },
  },
};

const cardVariants = {
  hidden: (custom: { zIndex: number }) => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    zIndex: custom.zIndex,
  }),
  visible: (custom: {
    position: ScatterPosition;
    zIndex: number;
    springConfig: Record<string, unknown>;
  }) => ({
    x: custom.position.x,
    y: custom.position.y,
    rotate: custom.position.rotation,
    scale: custom.position.scale,
    zIndex: custom.zIndex,
    transition: custom.springConfig,
  }),
};

export const ImageStack = React.forwardRef<ImageStackRef, ImageStackProps>(
  (
    {
      images = [],
      maxRotation = 15,
      scatterRadius = 40,
      seed = 12345,
      className = "",
      onReshuffle,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [imagesLoaded, setImagesLoaded] = React.useState(false);
    const [scatterPositions, setScatterPositions] = React.useState<ScatterPosition[]>([]);
    const [currentSeed, setCurrentSeed] = React.useState(seed);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const generateScatterPositions = React.useCallback(
      (seedValue: number) => {
        const rng = new SeededRandom(seedValue);
        return images.map(() => ({
          x: rng.range(-280, -240),
          y: rng.range(-scatterRadius, scatterRadius),
          rotation: rng.range(-maxRotation, maxRotation),
          scale: rng.range(0.95, 1.05),
        }));
      },
      [images, scatterRadius, maxRotation]
    );

    React.useEffect(() => {
      if (images.length === 0) { setImagesLoaded(true); return; }
      let settled = false;
      Promise.all(
        images.map(
          (image) =>
            new Promise<void>((resolve) => {
              const img = new window.Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = image.src;
            })
        )
      ).then(() => { if (!settled) { settled = true; setImagesLoaded(true); } });
      return () => { settled = true; };
    }, [images]);

    React.useEffect(() => {
      setScatterPositions(generateScatterPositions(currentSeed));
    }, [currentSeed, generateScatterPositions]);

    React.useEffect(() => {
      if (!imagesLoaded) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
        { threshold: 0.3 }
      );
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [imagesLoaded]);

    const reshuffle = React.useCallback(() => {
      const newSeed = Math.floor(Math.random() * 1000000);
      setCurrentSeed(newSeed);
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
      onReshuffle?.();
    }, [onReshuffle]);

    React.useImperativeHandle(ref, () => ({ reshuffle }), [reshuffle]);

    const springConfig = prefersReducedMotion
      ? { type: "tween", duration: 0.3 }
      : { type: "spring", stiffness: 100, damping: 20 };

    return (
      <div className={`relative w-full h-[900px] flex items-center justify-center overflow-hidden ${className}`}>
        <motion.div
          ref={containerRef}
          className="relative w-full h-full min-w-[1400px]"
          style={{ perspective: "1000px" }}
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500">Loading images…</div>
            </div>
          )}

          {images.map((image, index) => {
            const position = scatterPositions[index];
            if (!position) return null;
            return (
              <motion.div
                key={`${image.id}-${currentSeed}`}
                className="absolute"
                variants={cardVariants}
                custom={{ position, zIndex: images.length - index, springConfig }}
                style={{ left: "50%", top: "50%", marginLeft: "-160px", marginTop: "-225px" }}
              >
                <div className="bg-white p-6 shadow-xl border rounded-sm">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-80 h-96 object-cover rounded-sm"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='384'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280'%3EImage not found%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="mt-3 text-base text-gray-600 text-center font-medium">
                    {image.alt}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }
);
ImageStack.displayName = "ImageStack";

export default ImageStack;
