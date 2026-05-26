import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Services from "./components/Services";
import MoreServices from "./components/MoreServices";
import WhyUs from "./components/WhyUs";
import Mission from "./components/Mission";
import Membership from "./components/Membership";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <MoreServices />
        <WhyUs />
        <Mission />
        <Membership />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
