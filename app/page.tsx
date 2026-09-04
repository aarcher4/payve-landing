export default function Home() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-white">
      {/* Background image at 20% opacity */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/hero.png')" }}
      />

      {/* Centered content */}
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-24">
        <h1 className="max-w-5xl text-center text-balance font-serif font-medium text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-slate-600 leading-tight tracking-[-0.02em]">
          Orchestrated precision for supply chains that{" "}
          <span className="font-serif italic">feed the world</span>.
        </h1>
      </div>

      {/* Contact info - bottom right with safe area */}
      <div className="absolute bottom-6 right-6 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] md:bottom-8 md:right-8 z-10 text-right text-sm text-slate-500">
        <a
          href="mailto:jeff@getpayve.com"
          className="block py-1 hover:text-slate-700 motion-safe:transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          jeff@getpayve.com
        </a>
        <a
          href="mailto:alex@getpayve.com"
          className="block py-1 hover:text-slate-700 motion-safe:transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          alex@getpayve.com
        </a>
      </div>
    </main>
  );
}
