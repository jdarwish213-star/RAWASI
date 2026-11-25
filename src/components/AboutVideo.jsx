import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import tourVideo from "../assets/about-tour.mp4";
import tourPoster from "../assets/about-poster.jpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CAPTIONS = [
  {
    title: "تصاميم تخطف الأنظار",
    text: "واجهات معمارية عصرية تترك انطباعاً لا يُنسى من أول نظرة.",
  },
  {
    title: "فخامة تبدأ من المدخل",
    text: "مداخل ومواقف مدروسة بعناية تعكس مستوى العقار الذي تستحقه.",
  },
  {
    title: "تفاصيل داخلية بلا مساومة",
    text: "خامات راقية ومساحات مفتوحة مصممة لأعلى مستويات الراحة.",
  },
  {
    title: "نمط حياة متكامل",
    text: "مسابح وجلسات خارجية تجعل كل يوم تجربة استثنائية.",
  },
];

const TOTAL = CAPTIONS.length;
const VIDEO_SCROLL_DURATION = TOTAL + 1.1;

function AboutVideo() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const maskRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      const mask = maskRef.current;

      video.muted = true;

      const mm = gsap.matchMedia();

      // ===== الشاشات الكبيرة =====
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          video.loop = false;
          video.pause();

          ScrollTrigger.create({
            trigger: section,
            start: "top bottom+=80%",
            once: true,
            onEnter: () => {
              video.preload = "auto";
            },
          });

          const proxy = { p: 0 };
          let lastTime = -1;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=2400",
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // يبدأ الفيديو بكامل الشاشة مخفياً، ثم يظهر من اليسار إلى اليمين
          gsap.set(mask, {
            width: "100vw",
            height: "100vh",
            left: "0%",
            top: "0%",
            yPercent: 0,
            borderRadius: "0px",
            clipPath: "inset(0% 100% 0% 0%)",
          });

          tl.to(
            mask,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "power2.inOut",
            },
            0
          );

          // تحريك الفيديو مع التمرير
          tl.to(
            proxy,
            {
              p: 1,
              duration: VIDEO_SCROLL_DURATION,
              onUpdate: () => {
                if (!video.duration) return;
                const t = proxy.p * (video.duration - 0.04);
                if (Math.abs(t - lastTime) < 0.025) return;
                lastTime = t;
                video.currentTime = t;
              },
            },
            1.1
          );

          // زوم سينمائي خفيف
          tl.fromTo(
            ".av-video",
            { scale: 1 },
            { scale: 1.06, duration: VIDEO_SCROLL_DURATION },
            1.1
          );

          // شريط التقدم
          tl.to(
            ".av-progress",
            { scaleX: 1, duration: VIDEO_SCROLL_DURATION },
            1.1
          );

          // بطاقات النص تتغير مع التمرير
          CAPTIONS.forEach((_, i) => {
            const el = `.av-cap-${i}`;
            const startTime = 1.3 + i * 0.85;

            tl.fromTo(
              el,
              { autoAlpha: 0, x: 50 },
              { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out" },
              startTime
            );

            if (i < TOTAL - 1) {
              tl.to(
                el,
                { autoAlpha: 0, x: -30, duration: 0.3, ease: "power2.in" },
                startTime + 0.55
              );
            }
          });
        }
      );

      // ===== الهاتف =====
      mm.add(
        "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        () => {
          video.loop = true;
          video.preload = "none";

          gsap.set(mask, {
            width: "92%",
            height: "min(51.75vw, 70vh)",
            left: "0%",
            top: "auto",
            yPercent: 0,
            borderRadius: "16px",
            position: "relative",
            clipPath: "inset(0% 0% 0% 0%)",
          });

          const io = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                video.play().catch(() => {});
              } else {
                video.pause();
              }
            },
            { threshold: 0.3 }
          );

          io.observe(video);

          return () => io.disconnect();
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-night-2 lg:bg-white"
    >
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 overflow-hidden px-[6%] py-12 lg:h-screen lg:flex-row lg:gap-0 lg:px-0 lg:py-0">
        {/* خلفية داكنة ولمسة ذهبية على الهاتف، وبيضاء على اللابتوب */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-night-2 lg:bg-white" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)] lg:hidden" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[48vh] w-[76vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[100px] lg:hidden" />

        {/* الفيديو مخفي أولاً، ثم يُكشف بعرض الشاشة من اليسار */}
        <div
          ref={maskRef}
          className="absolute z-10 overflow-hidden border border-gold/30 bg-night shadow-[0_24px_80px_rgba(0,0,0,0.45)] will-change-[clip-path] lg:border-0 lg:shadow-none"
          style={{
            width: "100vw",
            height: "100vh",
            left: "0%",
            top: "0%",
            clipPath: "inset(0% 100% 0% 0%)",
          }}
        >
          <video
            ref={videoRef}
            src={tourVideo}
            poster={tourPoster}
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            aria-hidden="true"
            className="av-video absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* بطاقات التمرير وعبارة About Rawasi على اللابتوب */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-30 hidden w-full items-center px-[6%] lg:flex lg:w-[42%]">
          <div className="relative h-80 w-full max-w-md">
            <div className="mb-8 flex items-center gap-4">
              <span className="font-serif text-sm tracking-[0.25em] text-gold">
                About Rawasi
              </span>
              <span className="h-px w-14 bg-gold/50" />
            </div>

            {CAPTIONS.map((caption, i) => (
              <div
                key={caption.title}
                className={`av-cap-${i} absolute inset-x-0 top-14 opacity-0`}
              >
                <div className="rounded-2xl border border-gold/30 bg-night/75 p-7 shadow-xl backdrop-blur-md">
                  <span className="mb-3 block font-serif text-xs tracking-[0.3em] text-gold">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(TOTAL).padStart(2, "0")}
                  </span>

                  <h3 className="text-2xl font-bold leading-snug text-white md:text-3xl">
                    {caption.title}
                  </h3>

                  <p className="mt-4 text-base leading-relaxed text-white/80">
                    {caption.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* بطاقات النص أسفل الفيديو على الهاتف */}
        <div className="relative z-30 w-full space-y-4 lg:hidden">
          {CAPTIONS.map((caption, i) => (
            <article
              key={caption.title}
              className="rounded-2xl border border-gold/30 bg-black/35 p-5 shadow-xl backdrop-blur-sm"
            >
              <span className="mb-2 block font-serif text-xs tracking-[0.3em] text-gold">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(TOTAL).padStart(2, "0")}
              </span>

              <h3 className="text-xl font-bold leading-snug text-white">
                {caption.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {caption.text}
              </p>
            </article>
          ))}
        </div>

        {/* تدرج القراءة والعدّاد على اللابتوب فقط */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden bg-linear-to-l from-black/70 via-black/30 to-transparent lg:block" />

        <div className="absolute bottom-10 left-1/2 z-40 hidden w-40 -translate-x-1/2 lg:block">
          <div className="h-[1.5px] w-full bg-white/25">
            <div className="av-progress h-full origin-left scale-x-0 bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutVideo;