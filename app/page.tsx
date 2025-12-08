"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
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
        scrolled ? "bg-custom-grey/90 backdrop-blur-md border-b border-platinum/10" : ""
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="font-display text-2xl tracking-wide text-ivory">
            PAYVE
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#platform" className="text-sm text-platinum hover:text-ivory transition-colors font-light">Platform</a>
            <a href="#about" className="text-sm text-platinum hover:text-ivory transition-colors font-light">About</a>
          </div>
        </div>
      </nav>

      {/* Scene 1: Arrival (Hero) */}
      <section className="relative h-screen flex flex-col overflow-hidden">
        {/* Full-screen Hero Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.png.png')" }}
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
      </section>

      {/* Scene 2: The Trust */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-graphite/30 border-t border-platinum/10">
        <div className="max-w-5xl mx-auto">
          <div ref={addToRefs} className="reveal text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl text-ivory mb-4">
              Trusted by those who demand precision
            </h2>
          </div>

          {/* Logo Grid */}
          <div 
            ref={addToRefs}
            className="reveal stagger-1 grid grid-cols-2 md:grid-cols-4 gap-3 grayscale opacity-70 hover:opacity-100 transition-opacity duration-500"
          >
            <div className="h-24 bg-custom-grey border border-platinum/10 rounded-sm flex items-center justify-center hover:border-sage/30 transition-colors">
              <span className="font-display text-ivory text-base">Fortune Growers</span>
            </div>
            <div className="h-24 bg-custom-grey border border-platinum/10 rounded-sm flex items-center justify-center hover:border-sage/30 transition-colors">
              <span className="text-platinum/40 text-xs">Partner Logo</span>
            </div>
            <div className="h-24 bg-custom-grey border border-platinum/10 rounded-sm flex items-center justify-center hover:border-sage/30 transition-colors">
              <span className="text-platinum/40 text-xs">Partner Logo</span>
            </div>
            <div className="h-24 bg-custom-grey border border-platinum/10 rounded-sm flex items-center justify-center hover:border-sage/30 transition-colors">
              <span className="text-platinum/40 text-xs">Partner Logo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 3: The Vision */}
      <section id="platform" className="py-16 md:py-24 px-6 md:px-12 relative overflow-hidden border-t border-platinum/10">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 
            ref={addToRefs}
            className="reveal font-display text-3xl md:text-4xl lg:text-5xl text-ivory leading-tight mb-6"
          >
            Your supply chain is not a sequence.<br />
            <span className="text-sage">It is a living system.</span>
          </h2>
          
          <div 
            ref={addToRefs}
            className="reveal stagger-2 space-y-6 text-platinum text-base md:text-lg leading-relaxed font-light max-w-3xl mx-auto"
          >
            <p>
              Every shipment. Every inspection. Every invoice.<br />
              Every decision ripples through the whole.
            </p>
            <p>
              For too long, operators have managed this complexity
              with disconnected tools and reactive processes.<br />
              Finding problems after they&apos;ve already cost you.
            </p>
            <p className="text-ivory/90">
              We believe there is a better way.
            </p>
            <p>
              An agentic workforce—structured for your business,
              tailored to your operations—working in unison
              to orchestrate every element of your supply chain.
            </p>
            <p>
              Not automation. <span className="text-ivory">Orchestration.</span><br />
              Not alerts. <span className="text-ivory">Anticipation.</span><br />
              Not software. <span className="text-ivory">An extension of your team.</span>
            </p>
            <p className="text-ivory/90">
              This business never sleeps—but your operators work hard enough. 
              <span className="text-sage"> Let our agents handle the tireless operations</span>, 
              so you can focus on what matters most.
            </p>
          </div>
          
          <div 
            ref={addToRefs}
            className="reveal stagger-3 mt-12 grid md:grid-cols-3 gap-6 text-left border-t border-platinum/10 pt-8"
          >
            <div className="space-y-2 p-5 hover:bg-white/5 transition-colors rounded-lg group">
               <p className="font-display text-xl text-ivory">Orchestration</p>
               <p className="text-sm text-platinum/70">Automated synchronization of all supply chain nodes.</p>
            </div>
            <div className="space-y-2 p-5 hover:bg-white/5 transition-colors rounded-lg group">
               <p className="font-display text-xl text-ivory">Anticipation</p>
               <p className="text-sm text-platinum/70">Predictive modeling that solves problems before they occur.</p>
            </div>
            <div className="space-y-2 p-5 hover:bg-white/5 transition-colors rounded-lg group">
               <p className="font-display text-xl text-ivory">Financial Layer</p>
               <p className="text-sm text-platinum/70">A unified financial backbone powering every transaction across your operations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 3: The Operators */}
      <section id="about" className="py-16 md:py-24 px-6 md:px-12 bg-graphite/30 relative border-t border-platinum/10">
        <div className="max-w-7xl mx-auto">
          <div ref={addToRefs} className="reveal text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-ivory mb-4">
              Your Tireless Partners
            </h2>
            <p className="text-platinum text-base md:text-lg font-light max-w-2xl mx-auto">
              The supply chain never stops—and neither should your support. 
              <span className="text-ivory"> Our agents exist to lighten your load.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Data Alchemists */}
            <div 
              ref={addToRefs}
              className="reveal stagger-1 group bg-custom-grey border border-platinum/10 hover:border-sage/40 rounded-sm p-6 transition-all duration-300 relative overflow-hidden"
            >
              <div className="h-9 w-9 bg-sage/10 rounded-sm flex items-center justify-center mb-5 group-hover:bg-sage/20 transition-colors">
                 <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="font-display text-lg text-ivory mb-3 group-hover:text-sage transition-colors">
                Data Alchemists
              </h3>
              <p className="text-platinum/70 text-sm leading-relaxed">
                Invoices, inspections, purchase orders—our agents transform chaos 
                into structured intelligence. Clarity from complexity.
              </p>
            </div>

            {/* Workflow Architects */}
            <div 
              ref={addToRefs}
              className="reveal stagger-2 group bg-custom-grey border border-platinum/10 hover:border-sage/40 rounded-sm p-6 transition-all duration-300 relative overflow-hidden"
            >
              <div className="h-9 w-9 bg-sage/10 rounded-sm flex items-center justify-center mb-5 group-hover:bg-sage/20 transition-colors">
                 <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              </div>
              <h3 className="font-display text-lg text-ivory mb-3 group-hover:text-sage transition-colors">
                Workflow Architects
              </h3>
              <p className="text-platinum/70 text-sm leading-relaxed">
                Our agents adapt to your business—not the other way around. 
                Workflows tailored to how you actually operate.
              </p>
            </div>

            {/* Tireless Operators */}
            <div 
              ref={addToRefs}
              className="reveal stagger-3 group bg-custom-grey border border-platinum/10 hover:border-sage/40 rounded-sm p-6 transition-all duration-300 relative overflow-hidden"
            >
              <div className="h-9 w-9 bg-sage/10 rounded-sm flex items-center justify-center mb-5 group-hover:bg-sage/20 transition-colors">
                 <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-display text-lg text-ivory mb-3 group-hover:text-sage transition-colors">
                Tireless Operators
              </h3>
              <p className="text-platinum/70 text-sm leading-relaxed">
                24/7 execution and monitoring. Nothing falls through the cracks. 
                Rest knowing someone&apos;s always watching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 4: The Invitation */}
      <section className="py-16 md:py-24 px-6 md:px-12 relative overflow-hidden border-t border-platinum/10">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sage/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div ref={addToRefs} className="reveal space-y-6 mb-12">
            <p className="font-display text-2xl md:text-3xl lg:text-4xl text-ivory leading-tight">
              The supply chains that will define the next decade
              are being built today.
            </p>
            <div className="space-y-3 text-base md:text-lg text-platinum font-light">
              <p>They will be <span className="text-ivory font-normal">orchestrated</span>, not managed.</p>
              <p><span className="text-ivory font-normal">Anticipatory</span>, not reactive.</p>
              <p><span className="text-ivory font-normal">Precise</span>, not approximate.</p>
            </div>
            <p className="text-base md:text-lg text-ivory mt-8">
              If you&apos;re building one of them, we should talk.
            </p>
          </div>

          <div ref={addToRefs} className="reveal stagger-1">
            <button className="btn-primary px-8 py-3 text-sm">
              Talk to us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-platinum/10 py-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="font-display text-lg text-ivory mb-3">PAYVE</div>
              <p className="text-platinum text-sm leading-relaxed max-w-xs">
                Orchestrated precision for supply chains that <span className="font-serif italic">feed the world</span>.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-display text-sm text-ivory mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-platinum hover:text-ivory transition-colors text-sm">Overview</a></li>
                <li><a href="#" className="text-platinum hover:text-ivory transition-colors text-sm">Documentation</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-display text-sm text-ivory mb-3">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-platinum hover:text-ivory transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-platinum hover:text-ivory transition-colors text-sm">Perspectives</a></li>
                <li><a href="#" className="text-platinum hover:text-ivory transition-colors text-sm">Connect</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-platinum/10">
            <p className="text-platinum/60 text-xs mb-4 md:mb-0">
              © 2025 Payve
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="text-platinum/60 hover:text-ivory transition-colors text-xs">Privacy</a>
              <a href="#" className="text-platinum/60 hover:text-ivory transition-colors text-xs">Terms</a>
              <div className="flex items-center gap-3 ml-3">
                <a href="#" className="text-platinum/60 hover:text-ivory transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-platinum/60 hover:text-ivory transition-colors">
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

