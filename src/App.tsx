import { motion, useScroll, useSpring } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Numbers from "./components/Numbers";
import Problem from "./components/Problem";
import Services from "./components/Services";
import MoreServices from "./components/MoreServices";
import WhyUs from "./components/WhyUs";
import Mission from "./components/Mission";
import Process from "./components/Process";
import Membership from "./components/Membership";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <div className="min-h-screen bg-paper text-ink">
      <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Numbers />
        <Problem />
        <Services />
        <MoreServices />
        <WhyUs />
        <Mission />
        <Process />
        <Membership />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
