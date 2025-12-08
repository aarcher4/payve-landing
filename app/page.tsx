"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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

  const features = [
    {
      title: "Intelligent Orchestration",
      description: "Automated synchronization across every node in your supply chain. From procurement to delivery, every touchpoint stays in perfect harmony.",
      placeholder: "Dashboard showing real-time supply chain orchestration"
    },
    {
      title: "Predictive Intelligence",
      description: "AI-powered forecasting that identifies disruptions before they occur. Make proactive decisions with confidence.",
      placeholder: "Predictive analytics dashboard with forecasting charts"
    },
    {
      title: "Financial Integration",
      description: "A unified financial layer that connects payments, invoicing, and cash flow across your entire operation.",
      placeholder: "Financial dashboard with payment flows and reconciliation"
    },
    {
      title: "Agentic Workflows",
      description: "Autonomous agents that handle routine tasks 24/7—from document processing to exception handling.",
      placeholder: "Workflow automation interface with agent status"
    }
  ];

  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "10x Faster Processing",
      description: "Reduce manual processing time from days to minutes with intelligent automation."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "99.9% Accuracy",
      description: "Eliminate errors with AI-powered validation and intelligent exception handling."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: "Complete Visibility",
      description: "Real-time insights into every transaction, shipment, and financial flow."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "24/7 Operations",
      description: "Tireless agents that monitor and execute around the clock, never missing a beat."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Scale Seamlessly",
      description: "Handle 10x the volume without adding headcount. Grow without growing pains."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Unified Data",
      description: "One source of truth across all systems, partners, and transactions."
    }
  ];

  const testimonials = [
    {
      quote: "Payve transformed how we manage our entire supply chain. What used to take our team days now happens automatically in minutes.",
      name: "Sarah Chen",
      role: "VP Operations",
      company: "Fortune Growers",
      placeholder: "Professional headshot"
    },
    {
      quote: "The predictive capabilities alone have saved us millions in prevented disruptions. We see problems before they happen now.",
      name: "Michael Torres",
      role: "Chief Supply Chain Officer",
      company: "Pacific Produce Co.",
      placeholder: "Professional headshot"
    },
    {
      quote: "Finally, a platform that understands the complexity of agricultural supply chains. The financial integration is a game-changer.",
      name: "Jennifer Walsh",
      role: "CFO",
      company: "Harvest Direct",
      placeholder: "Professional headshot"
    }
  ];

  const partnerLogos = [
    "Fortune Growers",
    "Pacific Produce",
    "Harvest Direct",
    "AgriFlow",
    "FreshChain",
    "GreenPath Logistics"
  ];

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-bg-primary/90 backdrop-blur-xl border-b border-white/[0.06]" : ""
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-[72px] flex items-center justify-between">
          <div className="font-display text-xl tracking-wide text-ivory">
            PAYVE
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#platform" className="text-sm text-text-secondary hover:text-ivory transition-colors">Platform</a>
            <a href="#features" className="text-sm text-text-secondary hover:text-ivory transition-colors">Features</a>
            <a href="#about" className="text-sm text-text-secondary hover:text-ivory transition-colors">About</a>
            <button className="btn-primary">Get a Demo</button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Keeping as user likes it */}
      <section className="relative h-screen flex flex-col overflow-hidden">
        {/* Full-screen Hero Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.png.png')" }}
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-bg-primary z-10" />

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

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap gap-4 justify-center animate-fade-up"
              style={{ animationDelay: "0.6s" }}
            >
              <button className="btn-primary px-8 py-4 text-base">
                Get a Demo
              </button>
              <button className="btn-secondary px-8 py-4 text-base">
                Watch Video
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Logo Marquee */}
      <section className="py-12 border-t border-white/[0.06] bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p ref={addToRefs} className="reveal text-center text-text-tertiary text-sm mb-8">
            Trusted by industry leaders
          </p>
          <div className="logo-marquee">
            <div className="logo-marquee-track">
              {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-12 px-8 bg-bg-tertiary/50 border border-white/[0.06] rounded-lg flex items-center justify-center hover:border-sage/30 transition-all"
                >
                  <span className="text-text-secondary text-sm font-medium whitespace-nowrap">{logo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Statement */}
      <section id="platform" className="py-24 md:py-32 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div ref={addToRefs} className="reveal text-center">
            <p className="section-label mb-6">The Challenge</p>
            <h2 className="section-headline text-3xl md:text-4xl lg:text-5xl mb-8">
              Your supply chain is not a sequence.<br />
              <span className="text-sage">It is a living system.</span>
            </h2>
          </div>

          <div ref={addToRefs} className="reveal stagger-1 space-y-6 text-text-secondary text-lg leading-relaxed text-center max-w-3xl mx-auto">
            <p>
              Every shipment, inspection, and invoice creates ripples across your operation.
              For too long, teams have managed this complexity with disconnected tools—finding problems after they&apos;ve already cost you.
            </p>
            <p className="text-ivory">
              There is a better way.
            </p>
            <p>
              An agentic workforce structured for your business, working in unison to orchestrate every element of your supply chain.
            </p>
          </div>

          {/* Problem/Solution Visual Placeholder */}
          <div
            ref={addToRefs}
            className="reveal stagger-2 mt-16 placeholder-image aspect-[16/9] max-w-3xl mx-auto"
          >
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-text-muted text-sm">Supply chain visualization placeholder</p>
              <p className="text-text-muted/60 text-xs mt-1">1920 x 1080 recommended</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase with Tabs */}
      <section id="features" className="py-24 md:py-32 px-6 md:px-12 bg-bg-secondary/30 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div ref={addToRefs} className="reveal text-center mb-12">
            <p className="section-label mb-4">Capabilities</p>
            <h2 className="section-headline text-3xl md:text-4xl lg:text-5xl mb-6">
              A new operating system for supply chains
            </h2>
            <p className="sub-headline text-lg max-w-2xl mx-auto">
              Purpose-built tools that work together seamlessly, powered by intelligent agents.
            </p>
          </div>

          {/* Feature Tabs */}
          <div ref={addToRefs} className="reveal stagger-1 flex justify-center mb-10">
            <div className="feature-tabs">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`feature-tab ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  {feature.title}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Panels */}
          <div ref={addToRefs} className="reveal stagger-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-panel ${activeTab === index ? 'active' : ''}`}
              >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Feature Image Placeholder */}
                  <div className="placeholder-image aspect-[4/3] order-2 md:order-1">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-text-muted text-sm">{feature.placeholder}</p>
                      <p className="text-text-muted/60 text-xs mt-1">1200 x 900 recommended</p>
                    </div>
                  </div>
                  {/* Feature Description */}
                  <div className="order-1 md:order-2">
                    <h3 className="font-display text-2xl md:text-3xl text-ivory mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary text-lg leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <button className="btn-secondary">
                      Learn more
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo / Workflow Visualization */}
      <section className="py-24 md:py-32 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div ref={addToRefs} className="reveal text-center mb-16">
            <p className="section-label mb-4">How It Works</p>
            <h2 className="section-headline text-3xl md:text-4xl lg:text-5xl mb-6">
              See the platform in action
            </h2>
            <p className="sub-headline text-lg max-w-2xl mx-auto">
              Watch how Payve orchestrates complex supply chain operations with intelligent automation.
            </p>
          </div>

          {/* Full-width Product Demo Placeholder */}
          <div
            ref={addToRefs}
            className="reveal stagger-1 placeholder-image aspect-[16/9] w-full max-w-6xl mx-auto rounded-2xl"
          >
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-text-muted text-sm">Product interface / demo video placeholder</p>
              <p className="text-text-muted/60 text-xs mt-1">1440 x 900 recommended</p>
            </div>
          </div>

          {/* Workflow Steps */}
          <div ref={addToRefs} className="reveal stagger-2 grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-sage font-display text-lg">1</span>
              </div>
              <h4 className="font-display text-lg text-ivory mb-2">Connect Your Systems</h4>
              <p className="text-text-secondary text-sm">Seamlessly integrate with your existing ERP, TMS, and financial systems.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-sage font-display text-lg">2</span>
              </div>
              <h4 className="font-display text-lg text-ivory mb-2">Configure Your Agents</h4>
              <p className="text-text-secondary text-sm">Customize workflows and automation rules to match your operations.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-sage font-display text-lg">3</span>
              </div>
              <h4 className="font-display text-lg text-ivory mb-2">Watch It Work</h4>
              <p className="text-text-secondary text-sm">Agents handle operations 24/7 while you focus on strategic decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / Value Props */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-bg-secondary/30 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div ref={addToRefs} className="reveal text-center mb-16">
            <p className="section-label mb-4">Why Payve</p>
            <h2 className="section-headline text-3xl md:text-4xl lg:text-5xl mb-6">
              Built for operational excellence
            </h2>
            <p className="sub-headline text-lg max-w-2xl mx-auto">
              Every feature designed to eliminate friction and amplify your team&apos;s capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                ref={addToRefs}
                className={`reveal stagger-${(index % 6) + 1} benefit-card group`}
              >
                <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center mb-5 text-sage group-hover:bg-sage/20 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="font-display text-xl text-ivory mb-3">{benefit.title}</h3>
                <p className="text-text-secondary leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Tireless Partners - Operators Section */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div ref={addToRefs} className="reveal text-center mb-16">
            <p className="section-label mb-4">Meet the Agents</p>
            <h2 className="section-headline text-3xl md:text-4xl lg:text-5xl mb-6">
              Your tireless partners
            </h2>
            <p className="sub-headline text-lg max-w-2xl mx-auto">
              The supply chain never stops—and neither does your support.
              Our agents exist to lighten your load.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Data Alchemists */}
            <div
              ref={addToRefs}
              className="reveal stagger-1 group bg-bg-secondary border border-white/[0.06] hover:border-sage/40 rounded-2xl p-8 transition-all duration-300"
            >
              <div className="h-12 w-12 bg-sage/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sage/20 transition-colors">
                <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="font-display text-xl text-ivory mb-3 group-hover:text-sage transition-colors">
                Data Alchemists
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Invoices, inspections, purchase orders—our agents transform chaos into structured intelligence. Clarity from complexity.
              </p>
            </div>

            {/* Workflow Architects */}
            <div
              ref={addToRefs}
              className="reveal stagger-2 group bg-bg-secondary border border-white/[0.06] hover:border-sage/40 rounded-2xl p-8 transition-all duration-300"
            >
              <div className="h-12 w-12 bg-sage/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sage/20 transition-colors">
                <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              </div>
              <h3 className="font-display text-xl text-ivory mb-3 group-hover:text-sage transition-colors">
                Workflow Architects
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Our agents adapt to your business—not the other way around. Workflows tailored to how you actually operate.
              </p>
            </div>

            {/* Tireless Operators */}
            <div
              ref={addToRefs}
              className="reveal stagger-3 group bg-bg-secondary border border-white/[0.06] hover:border-sage/40 rounded-2xl p-8 transition-all duration-300"
            >
              <div className="h-12 w-12 bg-sage/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sage/20 transition-colors">
                <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-display text-xl text-ivory mb-3 group-hover:text-sage transition-colors">
                Tireless Operators
              </h3>
              <p className="text-text-secondary leading-relaxed">
                24/7 execution and monitoring. Nothing falls through the cracks. Rest knowing someone&apos;s always watching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-bg-secondary/30 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div ref={addToRefs} className="reveal text-center mb-16">
            <p className="section-label mb-4">Customer Stories</p>
            <h2 className="section-headline text-3xl md:text-4xl lg:text-5xl mb-6">
              Trusted by operators who demand precision
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                ref={addToRefs}
                className={`reveal stagger-${index + 1} testimonial-card`}
              >
                <blockquote className="text-ivory text-lg leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  {/* Avatar Placeholder */}
                  <div className="testimonial-avatar flex items-center justify-center border border-white/[0.06]">
                    <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ivory">{testimonial.name}</p>
                    <p className="text-text-tertiary text-sm">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Background */}
      <section className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-t border-white/[0.06]">
        {/* Background Placeholder */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 placeholder-image opacity-30">
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-bg-primary/60" />
          </div>
        </div>

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div ref={addToRefs} className="reveal space-y-6 mb-12">
            <p className="section-label mb-4">Get Started</p>
            <h2 className="section-headline text-3xl md:text-4xl lg:text-5xl">
              The supply chains of tomorrow are being built today.
            </h2>
            <div className="space-y-3 text-lg text-text-secondary">
              <p>They will be <span className="text-ivory font-medium">orchestrated</span>, not managed.</p>
              <p><span className="text-ivory font-medium">Anticipatory</span>, not reactive.</p>
              <p><span className="text-ivory font-medium">Precise</span>, not approximate.</p>
            </div>
            <p className="text-lg text-ivory mt-8">
              If you&apos;re building one of them, we should talk.
            </p>
          </div>

          <div ref={addToRefs} className="reveal stagger-1 flex flex-wrap gap-4 justify-center">
            <button className="btn-primary px-8 py-4 text-base">
              Get a Demo
            </button>
            <button className="btn-secondary px-8 py-4 text-base">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-16 px-6 md:px-12 bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-6 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="font-display text-xl text-ivory mb-4">PAYVE</div>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xs mb-6">
                Orchestrated precision for supply chains that <span className="font-serif italic">feed the world</span>.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-text-tertiary hover:text-ivory transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-text-tertiary hover:text-ivory transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-display text-sm text-ivory mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Overview</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Integrations</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Documentation</a></li>
              </ul>
            </div>

            {/* Solutions Links */}
            <div>
              <h4 className="font-display text-sm text-ivory mb-4">Solutions</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Agriculture</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Food & Beverage</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Distribution</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Logistics</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-display text-sm text-ivory mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-display text-sm text-ivory mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">API Reference</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Status</a></li>
                <li><a href="#" className="text-text-secondary hover:text-ivory transition-colors text-sm">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.06]">
            <p className="text-text-muted text-sm mb-4 md:mb-0">
              &copy; 2025 Payve. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-text-muted hover:text-ivory transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-text-muted hover:text-ivory transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-text-muted hover:text-ivory transition-colors text-sm">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
