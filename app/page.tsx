"use client";

import { useEffect, useRef, useState } from "react";
import { Placeholder } from "@/app/components/Placeholder";
import { StreamingText } from "@/app/components/StreamingText";
import { AgentWorkflow } from "@/app/components/AgentWorkflow";
import { MinutesCounter } from "@/app/components/MinutesCounter";
import { BankConnectTerminal } from "@/app/components/BankConnectTerminal";
import { SystemIntegrationMesh } from "@/app/components/SystemIntegrationMesh";
import { CustomerSpotlight } from "@/app/components/CustomerSpotlight";
import { CallToAction } from "@/app/components/CallToAction";
import { ContactModal } from "@/app/components/ContactModal";

export default function Home() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [headerOverWhite, setHeaderOverWhite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const integrationRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLElement>(null);
  const navHeight = 100; // Approximate header height

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      
      let isOverWhite = false;

      // Check integration section
      if (integrationRef.current) {
        const rect = integrationRef.current.getBoundingClientRect();
        if (rect.top <= navHeight && rect.bottom >= navHeight) {
          isOverWhite = true;
        }
      }

      // Check massive action section (if not already over white)
      if (!isOverWhite && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        if (rect.top <= navHeight && rect.bottom >= navHeight) {
          isOverWhite = true;
        }
      }

      // Check spotlight section
      if (!isOverWhite && spotlightRef.current) {
        const rect = spotlightRef.current.getBoundingClientRect();
        if (rect.top <= navHeight && rect.bottom >= navHeight) {
          isOverWhite = true;
        }
      }

      setHeaderOverWhite(isOverWhite);
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Full-screen Hero Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.png')" }}
        />
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 z-10" />
        
        {/* Hero Content - Centered */}
        <div className="relative z-30 w-full flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-20 md:py-0">
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
              <button 
                onClick={handleOpenModal}
                className="bg-white text-[#505050] text-base px-10 py-4 rounded-full font-medium hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Talk to us
              </button>
            </div>

          </div>
        </div>

        {/* Logo Section Overlay */}
        <div 
          className="relative w-full z-30 px-6 animate-fade-up pb-8 md:absolute md:bottom-8 md:pb-0"
          style={{ animationDelay: "0.8s" }}
        >
           <div className="max-w-4xl mx-auto text-center">
              <p className="text-white/70 text-xs uppercase tracking-[0.2em] mb-6 font-medium">Trusted by supply chain operators and innovators:</p>
              <div className="grid grid-cols-2 gap-4 place-items-center md:flex md:flex-wrap md:justify-center md:gap-6">
                 <div className="h-12 w-32 md:h-16 md:w-40 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center hover:bg-white/10 transition-colors p-4 relative group">
                    <img 
                      src="/partners/partner-1.png" 
                      alt="Partner Logo 1" 
                      className="max-w-full max-h-full object-contain filter grayscale brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-300 translate-y-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const container = (e.target as HTMLImageElement).parentElement;
                        const placeholder = container?.querySelector('span');
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    <span className="text-platinum/40 text-[10px] absolute" style={{ display: 'none' }}>Partner Logo 1</span>
                 </div>
                 <div className="h-12 w-32 md:h-16 md:w-40 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center hover:bg-white/10 transition-colors p-0 relative group">
                    <img 
                      src="/partners/partner-2.png" 
                      alt="Partner Logo 2" 
                      className="max-w-full max-h-full scale-[1.8] object-contain filter grayscale brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const container = (e.target as HTMLImageElement).parentElement;
                        const placeholder = container?.querySelector('span');
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    <span className="text-platinum/40 text-[10px] absolute" style={{ display: 'none' }}>Partner Logo 2</span>
                 </div>
                 <div className="h-12 w-32 md:h-16 md:w-40 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center hover:bg-white/10 transition-colors p-4 relative group">
                    <img 
                      src="/partners/partner-3.png" 
                      alt="Partner Logo 3" 
                      className="max-w-full max-h-full object-contain filter grayscale brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-300 translate-y-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const container = (e.target as HTMLImageElement).parentElement;
                        const placeholder = container?.querySelector('span');
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    <span className="text-platinum/40 text-[10px] absolute" style={{ display: 'none' }}>Partner Logo 3</span>
                 </div>
                 <div className="h-12 w-32 md:h-16 md:w-40 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center hover:bg-white/10 transition-colors p-2 relative group">
                    <img 
                      src="/partners/partner-4.png" 
                      alt="Partner Logo 4" 
                      className="max-w-full max-h-full scale-[1.2] object-contain filter grayscale brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const container = (e.target as HTMLImageElement).parentElement;
                        const placeholder = container?.querySelector('span');
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    <span className="text-platinum/40 text-[10px] absolute" style={{ display: 'none' }}>Partner Logo 4</span>
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
            <div ref={addToRefs} className="reveal order-2 md:order-1">
               <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory leading-[1.1] mb-6">
                Your supply chain is not a sequence.<br />
                <span className="text-sage">It is a living system.</span>
              </h2>
              <div className="space-y-6 text-platinum text-lg leading-relaxed font-light max-w-xl">
                <p>
                  Every shipment. Every inspection. Every invoice.
                  Every decision ripples through the chain.
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
            <div ref={addToRefs} className="reveal stagger-1 order-1 md:order-2">
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
                    This business never sleeps. 
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
          <div className="grid md:grid-cols-2 gap-16 items-stretch">
            <div ref={addToRefs} className="reveal flex flex-col justify-center order-2 md:order-1">
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
            <div ref={addToRefs} className="reveal stagger-1 relative flex items-center justify-center order-1 md:order-2">
               {/* Background Image Placeholder */}
               <div 
                 className="absolute -top-8 -bottom-8 md:-top-24 md:-bottom-24 left-0 right-0 z-0 bg-white/5 rounded-2xl border border-white/10 bg-cover bg-center bg-no-repeat"
                 style={{ backgroundImage: "url('/images/placeholders/terminal-bg.png')" }}
               />
               <div className="relative z-10 w-full">
                  <BankConnectTerminal />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 3.5: System Integration (New) */}
      <section ref={integrationRef} className="py-24 px-6 md:px-12 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
             {/* Left: Mesh Visualization */}
             <div ref={addToRefs} className="reveal h-full">
                <SystemIntegrationMesh />
             </div>

             {/* Right: Text Content */}
             <div ref={addToRefs} className="reveal stagger-1 flex flex-col justify-center">
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#505050] leading-tight mb-6">
                  We live in your systems.
                </h2>
                <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-light">
                  <p>
                    We integrate into your CRM, internal messaging applications, email, 
                    and banking systems to create a seamless agentic experience.
                  </p>
                  <p>
                    We meet you where you are at—a <span className="text-sage font-medium">seamless layer</span> in between your systems.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Scene 4: Massive Action */}
      <section ref={triggerRef} className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden bg-white border-t border-gray-200">
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-16 items-stretch">
            
            {/* Left: Text */}
            <div ref={addToRefs} className="reveal space-y-8 flex flex-col justify-center">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight text-[#505050]">
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
            <div ref={addToRefs} className="reveal stagger-1 flex flex-col text-center backdrop-blur-sm border rounded-2xl bg-gray-50 border-gray-200 w-full relative md:h-auto">
               <div className="p-6 flex flex-col items-center justify-center w-full h-full md:absolute md:inset-0">
                 <MinutesCounter isLightMode={true} className="w-auto h-auto max-h-full max-w-full" />
                 <div className="mt-4 h-1 w-24 bg-gradient-to-r from-transparent via-sage/50 to-transparent shrink-0" />
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Spotlight */}
      <section ref={spotlightRef} className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto relative z-10">
           <div ref={addToRefs} className="reveal">
              <CustomerSpotlight />
           </div>
        </div>
      </section>

      {/* Call To Action */}
      <CallToAction onOpenModal={handleOpenModal} />

      {/* Footer */}
      <footer className="transition-colors duration-700 border-t py-6 px-6 md:px-12 bg-white border-gray-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-xs transition-colors duration-700 text-gray-400">
            © 2025 Payve
          </p>
        </div>
      </footer>
      
      <ContactModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
}
