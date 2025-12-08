"use client";

import { useEffect, useState, useRef } from "react";

export const MinutesCounter = ({ isLightMode }: { isLightMode?: boolean }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
            setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
        observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [hasStarted]);

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

  // Calculate progress percentage (0 to 1)
  const progressPercentage = Math.min(count / 1000000, 1);
  const radius = 180; // Radius of the circle
  const stroke = 4; // Thickness of the stroke
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progressPercentage * circumference;

  return (
    <div ref={containerRef} className="relative flex items-center justify-center w-[400px] h-[400px]">
      {/* Progress Circle */}
      <svg
        height={radius * 2}
        width={radius * 2}
        className="absolute inset-0 m-auto rotate-[-90deg] transform"
      >
        {/* Background Track */}
        <circle
          stroke={isLightMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"}
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: 'stroke 0.7s ease-in-out' }}
        />
        {/* Progress Indicator */}
        <circle
          stroke={isLightMode ? "#505050" : "#C0C0C0"}
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.1s linear, stroke 0.7s ease-in-out'
          }}
        />
      </svg>
      
      {/* Counter Text */}
      <div className="font-display text-5xl md:text-6xl text-sage tabular-nums tracking-tighter relative z-10">
        {count.toLocaleString()}{count >= 1000000 ? "+" : ""}
      </div>
    </div>
  );
};
