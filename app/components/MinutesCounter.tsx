"use client";

import { useEffect, useState, useRef } from "react";

export const MinutesCounter = ({ isLightMode, className = "" }: { isLightMode?: boolean, className?: string }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
            setHasStarted(true);
        } else {
            setHasStarted(false);
            setCount(0);
            startTimeRef.current = null;
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
        observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []); // Remove hasStarted dependency to prevent recreation of observer on state change

  useEffect(() => {
    if (!hasStarted) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      
      // Target: 1,000,000
      // Duration: Let's aim for ~3-4 seconds to reach 1M for a nice effect
      // 1,000,000 / 3000ms = ~333/ms
      
      const speed = 350; 
      const currentCount = Math.floor(progress * speed);
      
      if (currentCount >= 1000000) {
          setCount(1000000);
      } else {
          setCount(currentCount);
          requestAnimationFrame(animate);
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [hasStarted]);

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      {/* Counter Text */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="font-display text-4xl md:text-5xl lg:text-6xl text-sage tabular-nums tracking-tighter">
          {count.toLocaleString()}{count >= 1000000 ? "+" : ""}
        </div>
        <div className="text-xs md:text-sm uppercase tracking-widest mt-2 text-gray-400">
          Minutes Deployed
        </div>
      </div>
    </div>
  );
};
