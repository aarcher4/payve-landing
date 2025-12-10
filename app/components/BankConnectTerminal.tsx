"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Loader2, Check } from "lucide-react";

export const BankConnectTerminal = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.5 }); // Trigger when 50% visible

  const [status, setStatus] = useState<"streaming" | "completed">("streaming");
  const [stepIndex, setStepIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  
  const steps = [
    "Surveying purchase orders...",
    "Analyzing discount opportunities...",
    "Referencing profitability expectations...",
    "Connecting bank account...",
    "Forecasting cash flow..."
  ];

  // A slightly softer, yet vibrant green (Mint/Emerald blend)
  const successColor = "#34D399"; 

  // Reset state when out of view
  useEffect(() => {
    if (!isInView) {
      setStatus("streaming");
      setStepIndex(0);
      setDisplayText("");
    }
  }, [isInView]);

  useEffect(() => {
    // Only run animation if in view and not completed
    if (!isInView || status === "completed") return;

    let currentText = "";
    const targetText = steps[stepIndex];
    let charIndex = 0;
    
    // Typewriter effect
    const typingInterval = setInterval(() => {
      if (charIndex <= targetText.length) {
        currentText = targetText.slice(0, charIndex);
        setDisplayText(currentText);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Wait before moving to next step
        setTimeout(() => {
          // Check if we're still in view before proceeding
          if (stepIndex < steps.length - 1) {
             // Only increment if we haven't been reset (which sets index to 0)
             setStepIndex(prev => {
                if (prev === stepIndex) return prev + 1; 
                return prev;
             });
             setDisplayText(""); // Clear for next phrase
          } else {
            setStatus("completed");
          }
        }, 1500); // Pause to read
      }
    }, 40);

    return () => {
      clearInterval(typingInterval);
    };
  }, [stepIndex, status, isInView]); // Depend on isInView to restart/pause

  return (
    <div ref={containerRef} className="w-full max-w-lg h-[140px] bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden flex flex-col font-mono text-xs md:text-sm shadow-2xl relative group mx-auto">
      {/* Header */}
      <div className="h-8 bg-[#2a2a2a] border-b border-white/5 flex items-center px-4 gap-2 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <AnimatePresence mode="popLayout">
          {status === "streaming" ? (
            <motion.div
              key="streaming"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex items-center gap-4 absolute"
            >
              {/* Subtle Spinner - Inline */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 flex items-center justify-center"
              >
                <Loader2 className="w-5 h-5 text-white/50" />
              </motion.div>
              
              {/* Streaming Text */}
              <div className="text-white/70 tracking-wider flex items-center min-w-[200px]">
                {displayText}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-1.5 h-3 bg-white/50 ml-1 inline-block align-middle"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="connected"
              initial={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-4 absolute"
            >
              <div className="relative flex items-center justify-center w-5 h-5">
                 {/* Soft Green Pulse - adjusted to center behind the check */}
                <motion.div
                  className="absolute inset-0 -m-2 rounded-full"
                  style={{ backgroundColor: successColor }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
                />
                
                {/* Check Circle - Now same size/style as spinner */}
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center relative z-10 border border-white/50 bg-white/10"
                >
                  <Check className="w-3 h-3 text-white/70" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-white/70 font-medium tracking-wide uppercase text-sm">
                  PAYMENT REVIEW COMPLETE
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
