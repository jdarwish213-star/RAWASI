import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiHome, FiTrendingUp, FiHeadphones, FiArrowLeft } from "react-icons/fi";
import { LuGem } from "react-icons/lu";

import svc1 from "../assets/svc1.jpg";
import svc2 from "../assets/svc2.jpg";
import svc3 from "../assets/svc3.jpg";
import svc4 from "../assets/svc4.jpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SERVICES = [
  { id: 1, icon: LuGem, title: "البيع والشراء", text: "نرافقك بكل خطوة لصفقة آمنة وبأفضل سعر.", bg: svc1 },
  { id: 2, icon: FiTrendingUp, title: "الاستثمار العقاري", text: "فرص استثمارية مدروسة بعوائد مستقرة.", bg: svc2 },
  { id: 3, icon: FiHome, title: "إدارة العقارات", text: "إدارة متكاملة تحافظ على قيمة عقارك.", bg: svc3 },
  { id: 4, icon: FiHeadphones, title: "الاستشارات العقارية", text: "استشارات من خبراء بسوق الخليج.", bg: svc4 },
];

const TITLE_WORDS = ["خدماتنا", "المتميزة"];

function Services() {
  const sectionRef = useRef(null);
  const counterRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const total = SERVICES.length;

      // ===== الشاشات الكبيرة: تثبيت + دخول مع السكرول + تبديل الخلفية =====
      mm.add("(min-width: 1024px)", () => {
        gsap.from(".svc-head > *", {
          opacity: 0,
          x: 50,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=2200",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            const i = Math.max(1, Math.ceil(tl.progress() * total));
            if (counterRef.current) {
              counterRef.current.textContent = String(i).padStart(2, "0");
            }
          },
        });

        // البطاقات تدخل من اليسار: البطاقة رقم i بتبدأ عند الثانية i
        tl.from(".svc-card", {
          x: -900,
          opacity: 0,
          rotate: -8,
          stagger: { each: 1 },
          duration: 1,
          ease: "power3.out",
        });

        // تبديل الخلفية مع دخول كل بطاقة
        SERVICES.forEach((_, i) => {
          if (i === 0) return;
          tl.to(`.svc-bg-${i}`, { opacity: 1, duration: 0.6, ease: "none" }, i)
            .to(`.svc-bg-${i - 1}`, { opacity: 0, duration: 0.6, ease: "none" }, i);
        });

        // زوم سينمائي بطيء على الخلفية + شريط التقدم
        tl.fromTo(".svc-bgs", { scale: 1 }, { scale: 1.1, ease: "none", duration: total }, 0)
          .to(".svc-progress", { scaleX: 1, ease: "none", duration: total }, 0);
      });

      // ===== الجوال: بدون تثبيت، الخلفية الأولى ثابتة =====
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".svc-head > *", {
          opacity: 0,
          x: 40,
          stagger: 0.1,
          duration: 0.8,
          scrollTrigger: { trigger: ".svc-head", start: "top 85%" },
        });

        gsap.from(".svc-card", {
          x: -80,
          opacity: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".svc-grid", start: "top 85%" },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-night px-[6%] py-24 lg:py-0"
    >
      {/* ===== الخلفيات (4 صور فوق بعض) ===== */}
      <div className="svc-bgs absolute inset-0">
        {SERVICES.map((s, i) => (
          <img
            key={s.id}
            src={s.bg}
            loading="lazy"
            alt=""
            className={`svc-bg-${i} absolute inset-0 h-full w-full object-cover ${
              i === 0 ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* طبقات التعتيم: خفيفة لتبقى الصورة واضحة والنص مقروء */}
      <div className="absolute inset-0 bg-night/55" />
      <div className="absolute inset-0 bg-linear-to-l from-night/90 via-night/30 to-night/60" />
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-night to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-night to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-325 items-center gap-14 lg:grid-cols-[1fr_2.2fr]">
        {/* ===== النص (يمين) ===== */}
        <div className="svc-head [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-4 text-gold">
            <span className="font-serif text-lg tracking-wide">Our Services</span>
            <span className="h-px w-20 bg-gold/70" />
          </div>

          <h2 className="mt-4 flex flex-wrap gap-x-4 text-4xl font-bold text-sand md:text-5xl">
            {TITLE_WORDS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </h2>

          <p className="mt-5 max-w-sm leading-loose text-sand/85">
            نقدم لك باقة متكاملة من الخدمات العقارية بأعلى معايير الجودة.
          </p>

          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-gold px-7 py-3 text-gold-light transition-all duration-300 hover:bg-gold hover:text-night"
          >
            <FiArrowLeft />
            تعرف على المزيد
          </a>

          <div className="mt-12 hidden items-center gap-4 lg:flex">
            <span className="font-serif text-3xl text-gold-light">
              <span ref={counterRef}>01</span>
              <span className="text-sand/50"> / {String(total(SERVICES)).padStart(2, "0")}</span>
            </span>
            <div className="h-px flex-1 bg-gold/30">
              <div className="svc-progress h-full origin-right scale-x-0 bg-gold" />
            </div>
          </div>
        </div>

        {/* ===== البطاقات ===== */}
        <div className="svc-grid grid grid-cols-2 gap-5 xl:grid-cols-4">
          {SERVICES.map(({ id, icon: Icon, title, text }) => (
            <div key={id} className="svc-card">
              <div className="group flex h-full min-h-70 flex-col items-center justify-center gap-4 rounded-3xl border border-gold/25 bg-night/50 p-6 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-3 hover:border-gold/60 hover:bg-night/70 hover:shadow-2xl hover:shadow-gold/10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 text-3xl text-gold transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-night">
                  <Icon />
                </div>
                <h3 className="text-lg font-bold text-sand">{title}</h3>
                <p className="text-sm leading-relaxed text-sand/70">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function total(arr) {
  return arr.length;
}

export default Services;