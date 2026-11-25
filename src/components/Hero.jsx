import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { FiChevronLeft, FiPhone } from "react-icons/fi";
import heroImg from "../assets/hero.jpg";

const links = ["الرئيسية", "العقارات", "خدماتنا", "من نحن", "المدونة"];

/* الـ Nav Bar: نفس التصميم داخل الجهاز وخارجه */
function NavBar({ fixed = false }) {
  return (
    <nav
      className={`${fixed ? "fixed" : "absolute"} inset-x-0 top-0 z-50 flex items-center justify-between px-[6%] py-6
        ${fixed ? "bg-night/70 backdrop-blur-md" : ""}`}
    >
      <a href="#home" className="leading-none">
        <span className="block text-3xl font-bold text-gold-light">رواسي</span>
        <span className="block text-[10px] tracking-[0.4em] text-sand/50">RAWASI</span>
      </a>

      <ul className="hidden gap-10 md:flex">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm font-light tracking-wide text-sand/60 transition hover:text-gold-light">
              {l}
            </a>
          </li>
        ))}
      </ul>

      <a href="#contact"
        className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-night transition hover:bg-gold-light">
        <FiPhone /> تواصل معنا
      </a>
    </nav>
  );
}

/* محتوى الـ Hero داخل الشاشة */

function HeroContent() {
  return (
    <div className="relative flex h-full w-full items-center overflow-hidden">
      <img
        src={heroImg}
        alt="فيلا فاخرة"
        className="absolute inset-0 h-full w-full animate-slow-zoom object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-night/90 via-night/40 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-night via-transparent to-night/50" />

      <NavBar />

      <div className="relative z-10 w-full px-[6%] pt-32 pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-6xl font-bold text-gold-light md:text-7xl">
            رواسي
          </h1>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-snug text-sand md:text-5xl">
            حيث تلتقي الفخامة بالاستقرار لتبدأ حياة تليق بك
          </h2>

          <p className="mt-6 text-lg text-sand/80">
            عقارات فاخرة ... لحياة أرقى
          </p>

          <a
            href="#properties"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-8 py-3 font-semibold text-night transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
          >
            <FiChevronLeft /> استكشف عقاراتنا
          </a>
        </div>
      </div>
    </div>
  );
}


function Hero() {
  const ref = useRef(null);
  const [showNav, setShowNav] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // نُظهر الـ Nav Bar الثابت عند انتهاء القسم فقط
  useMotionValueEvent(scrollYProgress, "change", (v) => setShowNav(v >= 0.999));

  // الجهاز: صغير وبعيد ← يعتدل ويملأ الشاشة
  const scale   = useTransform(scrollYProgress, [0, 0.7], [0.38, 1]);
  const rotate  = useTransform(scrollYProgress, [0, 0.6], [-28, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.6], [22, 0]);
  const y       = useTransform(scrollYProgress, [0, 0.7], ["6vh", "0vh"]);
  const radius  = useTransform(scrollYProgress, [0.5, 0.75], [80, 0]);
  const border  = useTransform(scrollYProgress, [0.5, 0.75], [28, 0]);

  // النص الخلفي والظل والخلفية تختفي مع السكرول
  const textOpacity   = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textScale     = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.4], [0.45, 0]);
  const bgOpacity     = useTransform(scrollYProgress, [0.55, 0.75], [1, 0]);

  const ease = [0.22, 1, 0.36, 1];

  return (
    <>
      {/* الـ Nav Bar الثابت: يظهر للأقسام التالية فقط */}
      <motion.div
        initial={false}
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -20 }}
        transition={{ duration: 0.4 }}
        style={{ pointerEvents: showNav ? "auto" : "none" }}
      >
        <NavBar fixed />
      </motion.div>

      <section id="home" ref={ref} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-night">
          {/* الخلفية الفاتحة */}
          <motion.div style={{ opacity: bgOpacity }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#eef0f2_0%,#c5cace_100%)]" />

          {/* كلمة رواسي: تدخل من اليمين */}
          <motion.div
            initial={{ x: "60vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          >
            <motion.div style={{ opacity: textOpacity, scale: textScale }} className="flex flex-col items-center">
              <span className="text-[24vw] font-black leading-none text-night/25">رواسي</span>
              <span className="mt-2 text-[3vw] font-light tracking-[0.8em] text-night/40">RAWASI</span>
            </motion.div>
          </motion.div>

          {/* الظل */}
          <motion.div style={{ opacity: shadowOpacity }}
            className="absolute bottom-[18vh] left-1/2 h-8 w-[32vw] -translate-x-1/2 rounded-full bg-black blur-2xl" />

          {/* الجهاز: يصعد من الأسفل */}
          <motion.div
            initial={{ y: "100vh" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.3, delay: 0.4, ease }}
            className="absolute inset-0 flex items-center justify-center perspective-[2600px]"
          >
            <motion.div
              style={{ scale, rotate, rotateX, y, borderRadius: radius, borderWidth: border }}
              className="h-screen w-screen origin-center overflow-hidden border-[#1a1412] bg-night shadow-[0_80px_140px_-30px_rgba(0,0,0,0.55)]"
            >
              <HeroContent />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Hero;
