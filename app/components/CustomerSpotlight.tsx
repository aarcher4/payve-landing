import React from 'react';

interface CustomerSpotlightProps {
  className?: string;
}

export const CustomerSpotlight: React.FC<CustomerSpotlightProps> = ({ className }) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Main Image Container */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-sm overflow-hidden bg-sage/10 mb-12 group cursor-pointer">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4d2e] to-[#2d6a4f] transition-transform duration-700 group-hover:scale-105">
           {/* Abstract pattern or placeholder for image */}
           <div className="absolute inset-0 opacity-20 bg-[url('/hero.png')] bg-cover bg-center mix-blend-overlay" />
        </div>
        
        {/* Overlay Stat */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-ivory text-center w-full px-4">
           {/* Icon or Label */}
           <div className="flex items-center gap-2 mb-2 opacity-90">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <span className="text-xs md:text-sm font-medium tracking-widest uppercase">Time Saved Weekly</span>
           </div>
           
           {/* Big Stat */}
           <div className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight">
             Dozens of Hours
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl">
        {/* Logo / Brand Name */}
        <div className="mb-6 flex items-center gap-3">
           <div className="h-8 w-8 rounded bg-[#1a4d2e] flex items-center justify-center text-ivory font-display text-lg">F</div>
           <span className="font-display text-xl tracking-wide text-[#505050]">FORTUNE GROWERS</span>
        </div>

        {/* Headline */}
        <h3 className="font-display text-3xl md:text-4xl text-[#505050] leading-tight mb-8 max-w-2xl">
          How Fortune Growers harnesses data to make decisions faster.
        </h3>

        {/* Quote */}
        <blockquote className="text-lg md:text-xl text-gray-500 font-light leading-relaxed mb-8 border-l-2 border-sage/30 pl-6 italic">
          "Payve has been an absolute game changer for Fortune Growers. Partnering with Payve instantly felt like we added an entire crew of dedicated specialists to our workforce. Payve helped us harness an unbelievable amount of unused data to make decisions faster and earlier, saving dozens of hours and eliminating thousands of dollars in waste and inefficiency every week."
          <footer className="mt-4 text-sm font-medium text-[#505050] not-italic">
            — Geoff Pence, Fortune Growers
          </footer>
        </blockquote>

        {/* Link / CTA */}
        <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#505050] text-white text-sm font-medium transition-all hover:bg-[#505050]/90 hover:gap-3 group">
          <span>Read the story</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

