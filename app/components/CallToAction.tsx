import { useRef, useEffect } from "react";

interface CallToActionProps {
  onOpenModal?: () => void;
}

export function CallToAction({ onOpenModal }: CallToActionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="pb-24 md:pb-32 pt-0 px-6 md:px-12 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="reveal">
          <div className="bg-gray-50/90 backdrop-blur-sm rounded-3xl py-8 px-6 md:py-10 md:px-12 w-full mx-auto border border-gray-100">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#505050] leading-[1.1] mb-4">
              Ready to orchestrate <br />
              <span className="text-sage font-serif italic">your supply chain?</span>
            </h2>

            <div className="pt-2">
              <button 
                onClick={onOpenModal}
                className="bg-[#505050] text-white text-base px-10 py-4 rounded-full font-medium hover:bg-[#404040] hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Talk to us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
