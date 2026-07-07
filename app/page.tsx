import CtaBand from "./components/home/CtaBand";
import Hero from "./components/home/Hero";
import HowItWorks from "./components/home/HowItWorks";
import LogoWall from "./components/home/LogoWall";
import ProductTour from "./components/home/ProductTour";
import Proof from "./components/home/Proof";
import TrustSection from "./components/home/TrustSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <LogoWall />
      <ProductTour />
      <HowItWorks />
      <Proof />
      <TrustSection />
      <CtaBand />
    </main>
  );
}
