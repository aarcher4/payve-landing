"use client";

import { useEffect, useState, useRef } from "react";

function Counter({ end, duration = 2000, label }: { end: number; duration?: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
          setCount(0);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-2xl md:text-3xl text-ivory tabular-nums leading-none mb-1">
        {count}
      </div>
      <div className="text-xs md:text-sm text-platinum/50 uppercase tracking-wider font-light">
        {label}
      </div>
    </div>
  );
}

export function StreamingText() {
  const [text, setText] = useState("");
  const fullText = "Your team of agents is always on.";
  const [isTyping, setIsTyping] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer for the section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
            setIsInView(true);
            setIsTyping(true);
        } else {
            setIsInView(false);
            setText("");
            setIsTyping(false);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Text typing effect
  useEffect(() => {
    if (!isInView) return;

    let timeout: NodeJS.Timeout;
    
    if (isTyping) {
      if (text.length < fullText.length) {
        timeout = setTimeout(() => {
          setText(fullText.slice(0, text.length + 1));
        }, 50 + Math.random() * 30);
      } else {
        setIsTyping(false);
      }
    } else {
      // Loop after delay
      timeout = setTimeout(() => {
        setText("");
        setIsTyping(true);
      }, 5000); 
    }

    return () => clearTimeout(timeout);
  }, [text, isTyping, isInView]);

  return (
    <section ref={sectionRef} className="w-full border-t border-b border-white/5 bg-white/[0.02] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          
          {/* Left Side: Streaming Text */}
          <div className="flex-1 w-full md:w-auto flex items-center justify-start gap-4">
             <div className="relative">
                <div className="w-3 h-3 rounded-full bg-sage animate-pulse shadow-[0_0_10px_rgba(143,179,161,0.5)]" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-sage animate-ping opacity-20" />
             </div>
             <div className="font-display text-lg md:text-2xl text-ivory/90 tracking-wide min-h-[1.5em] flex items-center">
                {text}
                <span className="ml-1 w-[2px] h-[1.2em] bg-sage animate-pulse inline-block align-middle" />
             </div>
          </div>

          {/* Right Side: Counters */}
          <div className="flex items-center gap-8 md:gap-16 border-t md:border-t-0 border-white/5 pt-6 md:pt-0 w-full md:w-auto justify-between md:justify-end">
            <Counter end={24} duration={1500} label="Hours / Day" />
            <Counter end={7} duration={2000} label="Days / Week" />
            <Counter end={365} duration={2500} label="Days / Year" />
          </div>
          
        </div>
      </div>
    </section>
  );
}
