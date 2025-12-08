import React from "react";

interface PlaceholderProps {
  className?: string;
  label?: string;
  minHeight?: string;
  videoSrc?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ 
  className = "", 
  label = "System Visualization",
  minHeight = "min-h-[400px]",
  videoSrc
}) => {
  return (
    <div className={`relative w-full ${minHeight} bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden group ${className}`}>
      {/* Video Background */}
      {videoSrc && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} 
      />
      
      {/* Corner Markers */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-sage/50 rounded-tl-sm" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-sage/50 rounded-tr-sm" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-sage/50 rounded-bl-sm" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-sage/50 rounded-br-sm" />

      {/* Scanline Animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sage/5 to-transparent h-[50%] w-full animate-scan pointer-events-none" />
      
      {/* Hover Glow */}
      <div className="absolute inset-0 bg-sage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

