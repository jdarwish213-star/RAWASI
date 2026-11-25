import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINKS = [
  { label: "الرئيسية", href: "#home" },
  { label: "العقارات", href: "#properties" },
  { label: "خدماتنا", href: "#services" },
  { label: "من نحن", href: "#about" },
  { label: "تواصل معنا", href: "#contact" },
];

const SOCIALS = [
  { icon: FaFacebookF, label: "فيسبوك", href: "https://www.facebook.com/" },
  { icon: FaInstagram, label: "إنستغرام", href: "https://www.instagram.com/" },
];

function Footer() {
  const footerRef = useRef(null);

  useGSAP(
    () => {
      const trigger = {
        trigger: footerRef.current,
        start: "top 92%",
        toggleActions: "play none none none",
      };

      // الشعار ينزل من فوق لليمين بسرعة وبارتداد خفيف
      gsap.from(".ft-logo", {
        y: -260,
        rotation: 180,
        opacity: 0,
        duration: 0.9,
        ease: "bounce.out",
        scrollTrigger: trigger,
      });

      // باقي العناصر
      gsap.from(".ft-item", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: trigger,
      });
    },
    { scope: footerRef }
  );

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative z-20 overflow-x-clip bg-night-2"
    >
      {/* خط ذهبي بالأعلى */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold to-transparent" />

      {/* ===== القسم الرئيسي ===== */}
      <div className="mx-auto grid max-w-325 gap-12 px-[6%] pb-12 pt-16 md:grid-cols-3 md:items-center">
        {/* 1) الشعار (يمين) */}
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-right">
          <div className="ft-logo">
            <a
              href="#home"
              aria-label="العودة للأعلى"
              className="flex h-28 w-28 flex-col items-center justify-center gap-0.5 rounded-full bg-linear-to-br from-gold-light via-gold to-[#a8864f] text-night shadow-[0_0_40px_rgba(216,183,126,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(216,183,126,0.55)]"
            >
              <svg viewBox="0 0 64 40" className="h-6 w-10" fill="none">
                <path
                  d="M2 36 L20 14 L30 26 L42 6 L62 36"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-lg font-bold leading-none">رواسي</span>
              <span className="font-serif text-[9px] tracking-[0.3em]">RAWASI</span>
            </a>
          </div>

          <p className="ft-item max-w-xs text-sm leading-relaxed text-sand/60">
            عقارات فاخرة لحياة أرقى، حيث يلتقي التميز بالاستقرار.
          </p>
        </div>

        {/* 2) الروابط السريعة (وسط) */}
        <nav className="ft-item">
          <h4 className="mb-5 text-center font-semibold text-gold-light">
            روابط سريعة
          </h4>
          <ul className="mx-auto grid w-fit grid-cols-2 gap-x-12 gap-y-3 text-sm">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="group flex items-center gap-3 text-sand/80 transition-all duration-300 hover:-translate-x-1 hover:text-gold-light"
                >
                  <span className="h-1.5 w-1.5 rotate-45 bg-gold/50 transition-all duration-300 group-hover:scale-150 group-hover:bg-gold" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3) السوشيال (يسار): أيقونات بدون نص */}
        <div className="ft-item text-center md:text-left">
          <h4 className="mb-5 font-semibold text-gold-light">تابعنا</h4>
          <div className="flex items-center justify-center gap-4 md:justify-start">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-lg text-sand/90 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-night hover:shadow-lg hover:shadow-gold/20"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ===== الشريط السفلي (لون مختلف) ===== */}
      <div className="bg-gold px-[6%] py-4">
        <p className="mx-auto max-w-325 text-center text-sm font-medium text-night">
          © {new Date().getFullYear()} رواسي. جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}

export default Footer;