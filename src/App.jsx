import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";


import Properties from "./components/Properties";
import Services from "./components/Services";
import ContactCTA from "./components/ContactCTA";
import Footer from "./components/Footer";
import AboutVideo from "./components/AboutVideo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function App() {
  // 1) إعداد AOS
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-quart",
      once: true,
      offset: 120,
    });

    window.addEventListener("load", AOS.refresh);
    return () => window.removeEventListener("load", AOS.refresh);
  }, []);

  // 2) شريط التقدم (خارج الـ useEffect)
  useGSAP(() => {
    gsap.to(".progress-bar", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  });

  return (
    <>
      {/* شريط التقدم الذهبي */}
      <div className="progress-bar fixed right-0 top-0 z-60 h-0.75 w-full origin-right scale-x-0 bg-gold" />

      <Navbar />
      <Hero />
      <AboutVideo/>
      
      <Properties/>
      
      <Services/>
      <ContactCTA/>
      <Footer/>
    </>
  );
}

export default App;