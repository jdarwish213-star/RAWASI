import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiPhone, FiMail, FiMessageCircle, FiSend } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TITLE = "مع رواسي .. نبدأ مستقبلاً أكثر رفاهية".split(" ");
const INTERESTS = ["شراء عقار", "استثمار", "إدارة عقار", "استشارة"];

const ORBIT = [
  { icon: FiPhone, left: "50%", top: "0%" },
  { icon: FiMail, left: "93.3%", top: "75%" },
  { icon: FiMessageCircle, left: "6.7%", top: "75%" },
];

function ContactCTA() {
  const sectionRef = useRef(null);
  const coreRef = useRef(null);
  const spinTween = useRef(null);
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [sent, setSent] = useState(false);

  // ===== الحركات الرئيسية =====
  useGSAP(
    () => {
      // دوران الأيقونات والنص الدائري
      gsap.to(".orbit", { rotation: 360, duration: 24, repeat: -1, ease: "none" });
      gsap.to(".orbit-icon", { rotation: -360, duration: 24, repeat: -1, ease: "none" });
      spinTween.current = gsap.to(".ring-text", {
        rotation: -360,
        duration: 18,
        repeat: -1,
        ease: "none",
      });
      gsap.fromTo(
        ".pulse",
        { scale: 1, opacity: 0.5 },
        { scale: 2.2, opacity: 0, duration: 3, repeat: -1, stagger: 1, ease: "power1.out" }
      );

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      });

      tl.from(".cta-word", { yPercent: 120, duration: 1, stagger: 0.1 })
        .from(".cta-sub", { opacity: 0, y: 20, duration: 0.8 }, 0.6)
        .from(
          ".cta-orb",
          { scale: 0, rotate: -90, opacity: 0, duration: 1.4, ease: "back.out(1.4)" },
          0.3
        )
        .from(
          ".orbit-icon-wrap",
          { scale: 0, stagger: 0.15, duration: 0.7, ease: "back.out(3)" },
          1.2
        );

      // تجميع المبنى من الأسفل للأعلى
      gsap.from(".building-part", {
        y: 90,
        opacity: 0,
        scaleY: 0.55,
        transformOrigin: "bottom center",
        stagger: 0.13,
        duration: 0.9,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".luxury-building",
          start: "top 78%",
        },
      });
    },
    { scope: sectionRef }
  );

  // ===== حركة النجاح بعد الإرسال =====
  useGSAP(
    () => {
      if (!sent) return;
      gsap.from(".ok-item", { opacity: 0, y: 30, stagger: 0.15, duration: 0.7, ease: "power3.out" });
      gsap.fromTo(
        ".ok-path",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.9, ease: "power2.out", delay: 0.3 }
      );
    },
    { scope: sectionRef, dependencies: [sent] }
  );

  // ===== تفاعل الماوس مع الدائرة =====
  const onEnter = () => {
    gsap.to(spinTween.current, { timeScale: 5, duration: 0.8 });
    gsap.to(coreRef.current, { scale: 1.08, duration: 0.5, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to(spinTween.current, { timeScale: 1, duration: 1 });
    gsap.to(coreRef.current, { scale: 1, x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
  };

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(coreRef.current, { x: x * 40, y: y * 40, duration: 0.5, ease: "power2.out" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    gsap.to(".cta-form-body", {
      opacity: 0,
      y: -20,
      duration: 0.4,
      onComplete: () => setSent(true),
    });
  };

  const inputClass =
    "w-full bg-transparent py-2.5 text-sand outline-none transition-colors duration-300 placeholder:text-sand/40 border-b border-gold/25 focus:border-gold";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0c0a09] px-[6%] py-24 md:py-32"
    >
      {/* توهج خفيف */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-150 w-150 rounded-full bg-gold/8 blur-[160px]" />

      <div className="relative z-10 mx-auto grid max-w-325 items-center gap-16 lg:grid-cols-2">
        
        {/* ===== الفورم - مبنى زجاجي فاخر ===== */}
        <div id="cta-form">
          <div className="flex items-center gap-4 text-gold">
            <span className="font-serif text-lg tracking-wide">Contact Us</span>
            <span className="h-px w-20 bg-gold/70" />
          </div>

          <h2 className="mt-4 flex flex-wrap gap-x-3 text-3xl font-bold leading-snug text-sand md:text-5xl">
            {TITLE.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-2">
                <span className="cta-word inline-block">{w}</span>
              </span>
            ))}
          </h2>

          <p className="cta-sub mt-4 text-sand/70">
            تواصل معنا الآن للحصول على استشارة مجانية من خبرائنا.
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="cta-form-body mt-12">
              <div className="luxury-building relative mx-auto max-w-85">
                
                {/* ===== قمة المبنى ===== */}
                <div className="building-part relative z-10 mx-auto mb-0 w-[72%]">
                  <div className="h-3 rounded-t-md bg-linear-to-b from-gold to-gold/60 shadow-[0_0_20px_rgba(216,183,126,0.3)]" />
                  <div className="mx-auto h-2 w-4/5 bg-gold/40" />
                </div>

                {/* ===== الطابق العلوي: الاسم + الجوال ===== */}
                <div className="building-part relative overflow-hidden border border-gold/40 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                  <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-linear-to-b from-gold/80 to-gold/30" />
                  <div className="absolute bottom-0 right-0 top-0 w-0.5 bg-linear-to-b from-gold/80 to-gold/30" />
                  
                  {/* لمعان زجاجي */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-white/10 to-transparent" />

                  <div className="relative grid gap-4 px-5 py-5 sm:grid-cols-2">
                    <input required type="text" placeholder="الاسم الكامل" className={inputClass} />
                    <input required type="tel" placeholder="رقم الجوال" className={inputClass} />
                  </div>
                  
                  <div className="relative flex justify-center gap-4 border-t border-white/10 py-2.5">
                    <div className="h-1.5 w-7 rounded-full bg-white/15" />
                    <div className="h-1.5 w-7 rounded-full bg-white/15" />
                    <div className="h-1.5 w-7 rounded-full bg-white/15" />
                  </div>
                </div>

                {/* ===== الطابق الأوسط: الاهتمامات ===== */}
                <div className="building-part relative overflow-hidden border border-t-0 border-gold/30 bg-white/4 backdrop-blur-xl">
                  <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-linear-to-b from-gold/50 to-gold/20" />
                  <div className="absolute bottom-0 right-0 top-0 w-0.5 bg-linear-to-b from-gold/50 to-gold/20" />
                  
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/5 to-transparent" />

                  <div className="relative flex flex-wrap justify-center gap-2 px-4 py-5">
                    {INTERESTS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setInterest(item)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${
                          interest === item
                            ? "border-gold bg-gold text-night shadow-[0_0_15px_rgba(216,183,126,0.4)]"
                            : "border-white/20 bg-white/5 text-sand/80 hover:border-gold/60 hover:bg-white/10"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ===== الطابق السفلي: الرسالة ===== */}
                <div className="building-part relative overflow-hidden border border-t-0 border-gold/30 bg-white/3 backdrop-blur-xl">
                  <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-linear-to-b from-gold/40 to-gold/15" />
                  <div className="absolute bottom-0 right-0 top-0 w-0.5 bg-linear-to-b from-gold/40 to-gold/15" />
                  
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/5 to-transparent" />

                  <div className="relative px-5 py-5">
                    <textarea
                      rows="3"
                      placeholder="رسالتك (اختياري)"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                {/* ===== قاعدة المبنى + الزر ===== */}
                <div className="building-part relative overflow-hidden border border-t-0 border-gold/50 bg-linear-to-b from-white/10 to-white/5 backdrop-blur-xl">
                  <div className="absolute bottom-0 left-0 top-0 w-0.75 bg-linear-to-b from-gold to-gold/40" />
                  <div className="absolute bottom-0 right-0 top-0 w-0.75 bg-linear-to-b from-gold to-gold/40" />
                  
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/15 to-transparent" />

                  <div className="relative flex justify-center px-5 py-6">
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-night shadow-[0_0_25px_rgba(216,183,126,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light hover:shadow-[0_0_35px_rgba(216,183,126,0.5)]"
                    >
                      <FiSend className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      إرسال الطلب
                    </button>
                  </div>
                </div>

                {/* ظل المبنى */}
                <div className="pointer-events-none absolute -bottom-6 left-1/2 h-8 w-[92%] -translate-x-1/2 rounded-full bg-black/60 blur-2xl" />
              </div>
            </form>
          ) : (
            <div className="mt-10 rounded-3xl border border-gold/30 bg-night-2/60 p-8 backdrop-blur-md">
              <svg className="ok-item h-20 w-20" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="24" stroke="#d8b77e" strokeOpacity=".3" strokeWidth="2" />
                <path
                  className="ok-path"
                  pathLength="1"
                  d="M14 27 l8 8 l16 -17"
                  stroke="#d8b77e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                />
              </svg>
              <h3 className="ok-item mt-4 text-2xl font-bold text-gold-light">وصلنا طلبك</h3>
              <p className="ok-item mt-2 text-sand/70">
                سيتواصل معك أحد خبرائنا بخصوص ({interest}) في أقرب وقت.
              </p>
              <button
                onClick={() => setSent(false)}
                className="ok-item mt-6 text-sm text-gold underline-offset-4 hover:underline"
              >
                إرسال طلب آخر
              </button>
            </div>
          )}
        </div>

        {/* ===== كرة التواصل (بدون تغيير) ===== */}
        <div className="flex justify-center">
          <div
            className="cta-orb relative h-75 w-75 sm:h-95 sm:w-95"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onMouseMove={onMove}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="pulse absolute inset-[27%] rounded-full border border-gold/50"
              />
            ))}

            <div className="orbit absolute inset-0 rounded-full border border-dashed border-gold/25">
              {ORBIT.map(({ icon: Icon, left, top }, i) => (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left, top }}
                >
                  <div className="orbit-icon-wrap">
                    <div className="orbit-icon flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-night-2 text-xl text-gold shadow-lg shadow-black/40">
                      <Icon />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <svg
              viewBox="0 0 200 200"
              className="ring-text absolute left-[11%] top-[11%] h-[78%] w-[78%]"
            >
              <defs>
                <path
                  id="ringPath"
                  d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
                />
              </defs>
              <text fill="#d8b77e" fontSize="11" fontFamily="Georgia, serif">
                <textPath href="#ringPath" textLength="500" lengthAdjust="spacing">
                  RAWASI • LUXURY REAL ESTATE • RAWASI • LUXURY REAL ESTATE •
                </textPath>
              </text>
            </svg>

            <a
              href="#cta-form"
              ref={coreRef}
              aria-label="تواصل مع رواسي"
              className="absolute inset-[27%] flex flex-col items-center justify-center gap-1 rounded-full bg-linear-to-br from-gold-light via-gold to-[#a8864f] text-night shadow-[0_0_60px_rgba(216,183,126,0.35)]"
            >
              <svg viewBox="0 0 64 40" className="h-7 w-11" fill="none">
                <path
                  d="M2 36 L20 14 L30 26 L42 6 L62 36"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xl font-bold leading-none">رواسي</span>
              <span className="flex items-center gap-1 text-[11px] font-semibold">
                <FiPhone /> تواصل معنا
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactCTA;