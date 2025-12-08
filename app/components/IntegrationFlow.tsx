"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Landmark, 
  FileText, 
  Database, 
  Mail, 
  Sparkles
} from "lucide-react";

// Define the grid coordinates (1000x600 space)
// Symmetric 5-Node Structure (Quincunx / Dice 5)
const CONFIG = {
  viewBox: { w: 1000, h: 600 },
  nodes: {
    // Center Hub
    hub:    { x: 500, y: 300, id: 'hub' },
    
    // Left Column
    bank:   { x: 250, y: 200, id: 'bank', label: 'Bank', icon: Landmark },
    docs:   { x: 250, y: 400, id: 'docs', label: 'Docs', icon: FileText },
    
    // Right Column
    crm:    { x: 750, y: 200, id: 'crm', label: 'CRM', icon: Database },
    email:  { x: 750, y: 400, id: 'email', label: 'Email', icon: Mail },
  }
};

export function IntegrationFlow() {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl aspect-[5/3] min-h-[500px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px"
          }} 
        />

        {/* --- Nodes Layer --- */}
        
        {/* Core Hub */}
        <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ 
                left: `${(CONFIG.nodes.hub.x / CONFIG.viewBox.w) * 100}%`, 
                top: `${(CONFIG.nodes.hub.y / CONFIG.viewBox.h) * 100}%` 
            }}
        >
            <motion.div 
                className="relative group cursor-default"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-sage/60 blur-3xl rounded-full animate-pulse group-hover:bg-sage/80 transition-colors scale-150" />
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sage to-sage/80 flex items-center justify-center shadow-[0_0_50px_rgba(143,179,161,0.6)] border-4 border-white/20 relative z-10 transition-transform duration-500 group-hover:scale-105">
                    <Sparkles className="w-14 h-14 text-white animate-spin-slow" />
                </div>
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap">
                     <span className="text-sage font-display tracking-[0.2em] text-lg uppercase font-bold text-shadow-glow">Payve Core</span>
                </div>
            </motion.div>
        </div>

        {/* Nodes */}
        <Node config={CONFIG.nodes.bank} delay={0.2} />
        <Node config={CONFIG.nodes.docs} delay={0.3} />
        <Node config={CONFIG.nodes.crm} delay={0.4} />
        <Node config={CONFIG.nodes.email} delay={0.5} />

      </div>
    </div>
  );
}

function Node({ config, delay }: { config: any, delay: number }) {
    const { x, y, label, icon: Icon } = config;
    
    return (
        <motion.div 
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20 group cursor-default"
            style={{ 
                left: `${(x / CONFIG.viewBox.w) * 100}%`, 
                top: `${(y / CONFIG.viewBox.h) * 100}%` 
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -15, 0] // Floating animation
            }}
            transition={{ 
                opacity: { delay, duration: 0.5 },
                scale: { delay, duration: 0.5, type: "spring" },
                y: { duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }
            }}
        >
            <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center relative transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-sage/30">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white to-gray-50" />
                <div className="absolute inset-0 rounded-3xl border border-white/20 shadow-inner" />
                
                <Icon className="w-12 h-12 text-custom-grey relative z-10 group-hover:text-sage transition-colors duration-300" />
                
                {/* Ping effect on hover */}
                <div className="absolute -inset-4 rounded-3xl bg-sage/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-90 group-hover:scale-100 blur-lg" />
            </div>
            
            <span className="text-sm font-medium tracking-wide bg-graphite/80 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg text-white/90 group-hover:bg-sage group-hover:text-white transition-all duration-300 whitespace-nowrap">
                {label}
            </span>
        </motion.div>
    );
}
