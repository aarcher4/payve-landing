"use client";

import { useEffect, useRef, useState } from "react";
import { Placeholder } from "@/app/components/Placeholder";
import { StreamingText } from "@/app/components/StreamingText";
import { AgentWorkflow } from "@/app/components/AgentWorkflow";
import { MinutesCounter } from "@/app/components/MinutesCounter";
import { BankConnectTerminal } from "@/app/components/BankConnectTerminal";

export default function Home() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [headerOverWhite, setHeaderOverWhite] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const navHeight = 100; // Approximate header height

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        // Switch nav colors when the header overlaps with the white section
        setHeaderOverWhite(rect.top <= navHeight && rect.bottom >= navHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <main className="min-h-screen bg-custom-grey">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 transition-all duration-300 ${
        scrolled 
          ? headerOverWhite 
            ? "bg-white/90 backdrop-blur-md border-b border-gray-200" 
            : "bg-custom-grey/90 backdrop-blur-md border-b border-platinum/10"
          : ""
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className={`font-display text-2xl tracking-wide transition-colors duration-700 ${headerOverWhite ? "text-[#505050]" : "text-ivory"}`}>
            PAYVE
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#platform" className={`text-sm transition-colors duration-700 font-light ${headerOverWhite ? "text-gray-500 hover:text-[#505050]" : "text-platinum hover:text-ivory"}`}>Platform</a>
            <a href="#about" className={`text-sm transition-colors duration-700 font-light ${headerOverWhite ? "text-gray-500 hover:text-[#505050]" : "text-platinum hover:text-ivory"}`}>About</a>
          </div>
        </div>
      </nav>

      {/* Scene 1: Arrival (Hero) */}
      <section className="relative h-screen flex flex-col overflow-hidden">
        {/* Full-screen Hero Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.png')" }}
        />
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 z-10" />
        
        {/* Hero Content - Centered */}
        <div className="relative z-30 w-full h-full flex items-center justify-center px-6 md:px-12">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Headline */}
            <h1 
              className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-ivory leading-[1.1] tracking-tight mb-6 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Orchestrated precision for supply chains that <span className="font-serif italic">feed the world</span>.
            </h1>
            
            {/* Subheadline */}
            <p 
              className="text-lg md:text-xl lg:text-2xl text-ivory/90 max-w-3xl mx-auto mb-10 font-light animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              A unified financial and agentic layer for modern supply chains.
            </p>
            
            {/* CTA Button */}
            <div 
              className="animate-fade-up"
              style={{ animationDelay: "0.6s" }}
            >
              <button className="bg-white text-[#505050] text-base px-10 py-4 rounded-full font-medium hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl">
                Talk to us
              </button>
            </div>

          </div>
        </div>

        {/* Logo Section Overlay */}
        <div 
          className="absolute bottom-8 left-0 right-0 z-30 px-6 animate-fade-up"
          style={{ animationDelay: "0.8s" }}
        >
           <div className="max-w-4xl mx-auto text-center">
              <p className="text-ivory/60 text-xs uppercase tracking-[0.2em] mb-4 font-medium">Trusted by supply chain operators:</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                 <div className="h-12 w-32 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
                    <span className="font-display text-ivory text-sm">Fortune Growers</span>
                 </div>
                 <div className="h-12 w-32 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
                    <span className="text-platinum/40 text-[10px]">Partner Logo</span>
                 </div>
                 <div className="h-12 w-32 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
                    <span className="text-platinum/40 text-[10px]">Partner Logo</span>
                 </div>
                 <div className="h-12 w-32 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
                    <span className="text-platinum/40 text-[10px]">Partner Logo</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Status Bar */}
      <StreamingText />

      {/* Scene 3: The Vision */}
      <section id="platform" className="relative overflow-hidden py-24 md:py-32">
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Header - Left Aligned */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div ref={addToRefs} className="reveal">
               <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory leading-[1.1] mb-6">
                Your supply chain is not a sequence.<br />
                <span className="text-sage">It is a living system.</span>
              </h2>
              <div className="space-y-6 text-platinum text-lg leading-relaxed font-light max-w-xl">
                <p>
                  Every shipment. Every inspection. Every invoice.
                  Every decision ripples through the whole.
                </p>
                <p>
                  For too long, operators have managed this complexity
                  with disconnected tools and reactive processes.
                  Finding problems after they&apos;ve already cost you.
                </p>
                <p className="text-ivory font-medium">
                  We believe there is a better way.
                </p>
              </div>
            </div>
            
            {/* Visual Placeholder */}
            <div ref={addToRefs} className="reveal stagger-1">
               <Placeholder 
                 label="Live Network Graph" 
                 minHeight="min-h-[500px]" 
                 videoSrc="/videos/network-graph.mp4"
               />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
             {/* Text Content */}
             <div ref={addToRefs} className="reveal stagger-2 order-2 md:order-2">
                <div className="space-y-6 text-platinum text-lg leading-relaxed font-light max-w-xl">
                   <p>
                    An agentic workforce—structured for your business,
                    tailored to your operations—working in unison
                    to orchestrate every element of your supply chain.
                  </p>
                  <p>
                    Not automation. <span className="text-ivory font-medium">Orchestration.</span><br />
                    Not alerts. <span className="text-ivory font-medium">Anticipation.</span><br />
                    Not software. <span className="text-ivory font-medium">An extension of your team.</span>
                  </p>
                  <p className="text-ivory/90 pt-4">
                    This business never sleeps—but your operators work hard enough. 
                    <span className="text-sage"> Let our agents handle the tireless operations</span>, 
                    so you can focus on what matters most.
                  </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 text-left border-t border-platinum/10 pt-8">
                  <div className="space-y-1">
                     <p className="font-display text-xl text-ivory">Orchestration</p>
                     <p className="text-sm text-platinum/70">Automated synchronization of all supply chain nodes.</p>
                  </div>
                  <div className="space-y-1">
                     <p className="font-display text-xl text-ivory">Anticipation</p>
                     <p className="text-sm text-platinum/70">Predictive modeling that solves problems before they occur.</p>
                  </div>
                  <div className="space-y-1">
                     <p className="font-display text-xl text-ivory">Financial Layer</p>
                     <p className="text-sm text-platinum/70">A unified financial backbone powering every transaction.</p>
                  </div>
                </div>
             </div>

             {/* Second Placeholder */}
             <div ref={addToRefs} className="reveal stagger-3 order-1 md:order-1">
                <AgentWorkflow />
             </div>
          </div>
          
        </div>
      </section>

      {/* Scene 3: Deep Integration */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-12 bg-graphite/30 relative border-t border-platinum/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div ref={addToRefs} className="reveal">
              <h2 className="font-display text-4xl md:text-5xl text-ivory mb-6 leading-tight">
                Every dollar. Every day. Every detail.
              </h2>
              
              <div className="space-y-8 text-platinum text-lg font-light leading-relaxed">
                <p>
                  Short-term wins compound into long-term gains. We're here to check every number, 
                  enforce every policy, and capture every opportunity to optimize your cash position and profitability.
                </p>
                <p>
                  An extra set of eyes validating each transaction. Catching discrepancies before 
                  they become losses. Ensuring compliance isn't just a checkbox—it's continuous.
                </p>
                <p>
                  Capital efficiency isn't a goal. It's the discipline that lets you grow.
                </p>
              </div>
            </div>

            {/* Visual */}
            <div ref={addToRefs} className="reveal stagger-1">
               <BankConnectTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* Scene 4: Massive Action */}
      <section ref={triggerRef} className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden bg-white border-t border-gray-200">
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text */}
            <div ref={addToRefs} className="reveal space-y-8">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-[#505050]">
                Deploying a workforce of massive action.
              </h2>
              <div className="space-y-6 text-lg md:text-xl font-light text-gray-500">
                 <p>
                   We add minutes to your organization and manage the tedious work 
                   so you can focus on higher-level thinking.
                 </p>
              </div>
            </div>

            {/* Right: Counter */}
            <div ref={addToRefs} className="reveal stagger-1 flex flex-col items-center justify-center text-center p-12 backdrop-blur-sm border rounded-2xl bg-gray-50 border-gray-200">
               <MinutesCounter isLightMode={true} />
               <div className="mt-4 h-1 w-24 bg-gradient-to-r from-transparent via-sage/50 to-transparent" />
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="transition-colors duration-700 border-t py-12 px-6 md:px-12 bg-white border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="font-display text-lg mb-3 text-[#505050]">PAYVE</div>
              <p className="text-sm leading-relaxed max-w-xs text-gray-500">
                Orchestrated precision for supply chains that <span className="font-serif italic">feed the world</span>.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-display text-sm mb-3 text-[#505050]">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm transition-colors duration-700 text-gray-500 hover:text-[#505050]">Overview</a></li>
                <li><a href="#" className="text-sm transition-colors duration-700 text-gray-500 hover:text-[#505050]">Documentation</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-display text-sm mb-3 text-[#505050]">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm transition-colors duration-700 text-gray-500 hover:text-[#505050]">About</a></li>
                <li><a href="#" className="text-sm transition-colors duration-700 text-gray-500 hover:text-[#505050]">Perspectives</a></li>
                <li><a href="#" className="text-sm transition-colors duration-700 text-gray-500 hover:text-[#505050]">Connect</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t transition-colors duration-700 border-gray-200">
            <p className="text-xs mb-4 md:mb-0 transition-colors duration-700 text-gray-400">
              © 2025 Payve
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="text-xs transition-colors duration-700 text-gray-400 hover:text-[#505050]">Privacy</a>
              <a href="#" className="text-xs transition-colors duration-700 text-gray-400 hover:text-[#505050]">Terms</a>
              <div className="flex items-center gap-3 ml-3">
                <a href="#" className="transition-colors duration-700 text-gray-400 hover:text-[#505050]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="transition-colors duration-700 text-gray-400 hover:text-[#505050]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

