import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Numbers from "./components/Numbers";
import Services from "./components/Services";
import Week from "./components/Week";
import HowItWorks from "./components/HowItWorks";
import Membership from "./components/Membership";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useReveal } from "./hooks/useReveal";
import { useScrollProgress } from "./hooks/useScrollProgress";

export default function App() {
  useReveal();
  useScrollProgress();
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="scroll-progress" aria-hidden>
        <span />
      </div>
      <Navbar />
      <main>
        <Hero />
        <Numbers />
        <Services />
        <Week />
        <HowItWorks />
        <Membership />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
