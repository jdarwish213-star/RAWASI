import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { FiPhone, FiMail, FiMapPin, FiArrowUp } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ⚠️ عدّلي هذه البيانات ببيانات الشركة الحقيقية */
const CONTACT = {
  phone: "+971 00 000 0000",
  phoneHref: "tel:+971000000000",
  whatsapp: "https://wa.me/971000000000",
  email: "info@rawasi.com",
  address: "دبي، الإمارات العربية المتحدة",
};

const LINKS = [
  { label: "الرئيسية", href: "#home" },
  { label: "العقارات", href: "#properties" },
  { label: "خدماتنا", href: "#services" },
  { label: "من نحن", href: "#about" },
  { label: "تواصل معنا", href: "#contact" },
];

const SOCIALS = [
  { icon: FaInstagram, label: "إنستغرام", href: "https://www.instagram.com/" },
  { icon: FaFacebookF, label: "فيسبوك", href: "https://www.facebook.com/" },
];

/* ===== إعدادات الكلمة ثلاثية الأبعاد ===== */
const DEPTH_LAYERS = 14; // عدد طبقات السماكة
const LAYER_GAP = 1.5; // المسافة بين كل طبقة (px)
const REST_X = -14; // ميلان الكلمة الافتراضي ليظهر العمق

// نفس الستايل للوجه الأمامي ولطبقات السماكة حتى تتطابق تماماً
const WORD_CLASS =
  "block whitespace-nowrap text-center text-[min(12vw,150px)] font-black leading-[1.15]";

function Footer() {
  const footerRef = useRef(null);
  const wordRef = useRef(null);

  useGSAP(
    () => {
      const word = wordRef.current;

      // وضعية البداية: مائلة قليلاً ليظهر العمق حتى بدون حركة
      gsap.set(word, { rotateX: REST_X, rotateY: 0 });

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // دخول واحد هادئ عند الوصول للفوتر
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        tl.from(".ft-col", { opacity: 0, y: 24, stagger: 0.1, duration: 0.8 }).from(
          ".ft-stage",
          { opacity: 0, y: 60, duration: 1.2 },
          0.3
        );
      });

      // اللمس: تمايل بطيء بدل الماوس
      mm.add("(prefers-reduced-motion: no-preference) and (hover: none)", () => {
        gsap.fromTo(
          word,
          { rotateY: -14 },
          { rotateY: 14, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 }
        );
      });

      return () => mm.revert();
    },
    { scope: footerRef }
  );

  // ميلان حسب مكان الماوس (مثل بطاقات العقارات)
  const handleMove = (e) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(wordRef.current, {
      rotateY: x * 28,
      rotateX: REST_X - y * 14,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    gsap.to(wordRef.current, {
      rotateY: 0,
      rotateX: REST_X,
      duration: 0.9,
      ease: "power3.out",
    });
  };

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative z-20 overflow-hidden bg-night-2"
    >
      {/* خط ذهبي علوي + توهج خفيف مثل قسم العقارات */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-0 h-125 w-125 rounded-full bg-gold/10 blur-[140px]" />

      {/* ===== الأعمدة ===== */}
      <div className="relative mx-auto grid max-w-325 gap-12 px-[6%] pb-10 pt-20 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_auto] lg:gap-16">
        {/* الشعار: نفس شعار النافبار */}
        <div className="ft-col">
          <a
            href="#home"
            aria-label="رواسي، العودة للأعلى"
            className="inline-flex flex-col items-center"
          >
            <span className="text-4xl font-bold leading-[1.2] text-gold-light">
              رواسي
            </span>
            <span className="mt-2 font-serif text-[10px] leading-none tracking-[0.4em] text-gold">
              RAWASI
            </span>
          </a>

          <p className="mt-6 max-w-xs leading-loose text-sand/70">
            عقارات فاخرة لحياة أرقى، حيث يلتقي التميز بالاستقرار.
          </p>
        </div>

        {/* روابط */}
        <nav className="ft-col" aria-label="روابط الموقع">
          <h4 className="mb-6 font-semibold text-gold-light">روابط سريعة</h4>
          <ul className="space-y-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative inline-block py-1 text-sand/75 transition-colors duration-300 hover:text-gold-light
                    after:absolute after:bottom-0 after:right-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* التواصل */}
        <div className="ft-col">
          <h4 className="mb-6 font-semibold text-gold-light">تواصل معنا</h4>

          <ul className="space-y-4 text-sand/75">
            <li>
              <a
                href={CONTACT.phoneHref}
                className="flex items-center gap-3 transition-colors hover:text-gold-light"
              >
                <FiPhone className="shrink-0 text-lg text-gold" />
                <span dir="ltr">{CONTACT.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 transition-colors hover:text-gold-light"
              >
                <FiMail className="shrink-0 text-lg text-gold" />
                <span dir="ltr">{CONTACT.email}</span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FiMapPin className="shrink-0 text-lg text-gold" />
              {CONTACT.address}
            </li>
          </ul>

          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3 font-semibold text-night transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
          >
            <FaWhatsapp className="text-xl" />
            راسلنا على واتساب
          </a>
        </div>

        {/* السوشيال */}
        <div className="ft-col">
          <h4 className="mb-6 font-semibold text-gold-light">تابعنا</h4>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-lg text-sand transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-night"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ===== كلمة رواسي ثلاثية الأبعاد (كاملة وغير مقصوصة) ===== */}
      <div
        aria-hidden="true"
        className="ft-stage relative flex justify-center select-none px-[6%] py-8 md:py-10"
        style={{ perspective: "1200px" }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {/* توهج أرضي خلف الكلمة */}
        <div className="pointer-events-none absolute inset-x-[15%] bottom-6 h-24 rounded-full bg-gold/15 blur-[80px]" />

        <div
          ref={wordRef}
          className="relative shrink-0 will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* طبقات السماكة: من الأفتح (قريب) إلى الأغمق (بعيد) */}
          {Array.from({ length: DEPTH_LAYERS }).map((_, i) => (
            <span
              key={i}
              className={`${WORD_CLASS} absolute inset-0`}
              style={{
                transform: `translateZ(${-(i + 1) * LAYER_GAP}px)`,
                color: `hsl(38 38% ${36 - (i / DEPTH_LAYERS) * 26}%)`,
              }}
            >
              رواسي
            </span>
          ))}

          {/* الوجه الأمامي الذهبي */}
          <span
            className={`${WORD_CLASS} relative bg-linear-to-b from-gold-light via-gold to-[#a8864f] bg-clip-text text-transparent`}
          >
            رواسي
          </span>
        </div>
      </div>

      {/* ===== زر العودة للأعلى (فوق الخط) ===== */}
      <div className="relative z-10 flex justify-center px-[6%] pb-6">
        <a
          href="#home"
          aria-label="العودة للأعلى"
          className="group inline-flex items-center gap-3 text-sm text-sand/70 transition-colors hover:text-gold-light"
        >
          العودة للأعلى
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold group-hover:bg-gold group-hover:text-night">
            <FiArrowUp />
          </span>
        </a>
      </div>

      {/* ===== الشريط السفلي: الحقوق فقط بالمنتصف ===== */}
      <div className="relative z-10 border-t border-gold/20 px-[6%] py-5">
        <p className="mx-auto max-w-325 text-center text-sm text-sand/60">
          © {new Date().getFullYear()} رواسي. جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}

export default Footer;
