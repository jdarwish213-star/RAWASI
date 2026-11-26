import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiPhone, FiMail, FiClock, FiSend } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger, useGSAP);


const CONTACT = {
  phone: "+971 00 000 0000",
  phoneHref: "tel:+971000000000",
  whatsapp: "https://wa.me/971000000000",
  email: "info@rawasi.com",
  hours: "السبت – الخميس، 9 ص – 6 م",
};

const INTERESTS = ["شراء عقار", "استثمار", "إدارة عقار", "استشارة"];

const CHANNELS = [
  { icon: FiPhone, label: "اتصل بنا", value: CONTACT.phone, href: CONTACT.phoneHref, ltr: true },
  { icon: FaWhatsapp, label: "واتساب", value: "ابدأ محادثة مباشرة", href: CONTACT.whatsapp, external: true },
  { icon: FiMail, label: "البريد الإلكتروني", value: CONTACT.email, href: `mailto:${CONTACT.email}`, ltr: true },
];


/* نمط نجمة ثمانية (خاتم) هندسي إسلامي بخطوط ذهبية رفيعة */
const PATTERN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#d8b77e" stroke-width="1"><rect x="20" y="20" width="40" height="40"/><rect x="20" y="20" width="40" height="40" transform="rotate(45 40 40)"/><circle cx="40" cy="40" r="7"/></svg>`;
const PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(PATTERN_SVG)}")`;

const INITIAL = { name: "", phone: "", email: "", message: "" };

/* ===== التحقق ===== */
function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "أدخل اسمك الكامل";
  if (!/^\+?[\d\s-]{8,15}$/.test(v.phone.trim())) e.phone = "أدخل رقم جوال صحيح";
  if (v.email.trim() && !/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "صيغة البريد غير صحيحة";
  return e;
}


async function sendRequest(data) {
  console.log("Contact request:", data);
  await new Promise((r) => setTimeout(r, 1200));
}

/* ===== حقل بعنوان عائم ===== */
function Field({ id, label, error, as: Tag = "input", ...props }) {
  return (
    <div>
      <div className="relative">
        <Tag
          id={id}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`peer w-full rounded-xl border bg-night/60 px-4 pb-2 pt-6 text-sand outline-none transition-colors duration-300 focus:border-gold ${
            error ? "border-red-400/60" : "border-gold/20"
          } ${Tag === "textarea" ? "resize-none" : ""}`}
          {...props}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute right-4 top-4 text-sand/50 transition-all duration-200
            peer-focus:top-2 peer-focus:text-xs peer-focus:text-gold
            peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

function ContactCTA() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  const [values, setValues] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const errors = validate(values);

  const bind = (key) => ({
    name: key,
    value: values[key],
    onChange: (e) => setValues((v) => ({ ...v, [key]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [key]: true })),
    error: touched[key] ? errors[key] : undefined,
  });

 
  useGSAP(
    () => {
      const section = sectionRef.current;
      const mm = gsap.matchMedia();

      // ===== اللابتوب =====
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".ct-disc", { scale: 0.02 });
        gsap.set(".ct-glow", { opacity: 0 });
        gsap.set(".ct-panel", { yPercent: -120 });
        gsap.set(".ct-in", { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top bottom", // أول ما يظهر القسم من أسفل الشاشة
            end: "top top", // حتى يصل لأعلى الشاشة (مسافة التمرير الطبيعية فقط)
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // 1) الدائرة تنفتح من حد القسم العلوي وتملأ القسم كله
        tl.to(".ct-disc", { scale: 1, duration: 0.6, ease: "power2.out" }, 0)
          .to(".ct-glow", { opacity: 1, duration: 0.4 }, 0.35)
          // 2) الفورم ينزل من الأعلى
          .to(".ct-panel", { yPercent: 0, duration: 0.55, ease: "power3.out" }, 0.4)
          // 3) المحتوى يظهر
          .to(".ct-in", { opacity: 1, y: 0, stagger: 0.03, duration: 0.25, ease: "power2.out" }, 0.75);
      });

      // ===== الجوال: دخول بسيط =====
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ct-in", {
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ct-panel", start: "top 80%" },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  /* ===== حركة النجاح ===== */
  useGSAP(
    () => {
      if (status !== "sent") return;
      gsap.from(".ok-item", { opacity: 0, y: 24, stagger: 0.12, duration: 0.7, ease: "power3.out" });
      gsap.fromTo(
        ".ok-path",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.9, ease: "power2.out", delay: 0.25 }
      );
    },
    { scope: sectionRef, dependencies: [status] }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (e.currentTarget.elements.website.value) return; // فخ للبوتات

    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      setTouched({ name: true, phone: true, email: true });
      formRef.current?.querySelector(`#ct-${firstKey}`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      await sendRequest({ ...values, interest });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(INITIAL);
    setTouched({});
    setInterest(INTERESTS[0]);
    setStatus("idle");
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-night lg:h-screen"
    >
      {/* الدائرة: تنفتح من منتصف الحد العلوي للقسم (هادئة، بحد ذهبي رفيع) */}
      <div
        aria-hidden="true"
        className="ct-disc pointer-events-none absolute left-1/2 top-0 z-0 h-[170vmax] w-[170vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/30 bg-night-2 shadow-[0_0_120px_rgba(216,183,126,0.18)]"
      />
      <div
        aria-hidden="true"
        className="ct-glow pointer-events-none absolute inset-x-0 top-0 z-0 h-[70vh] bg-[radial-gradient(ellipse_at_top,rgba(216,183,126,0.12),transparent_65%)]"
      />

      {/* توهج ذهبي خلف المستطيل */}
      <div className="ct-glow pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[120px]" />

      {/* ===== المستطيل الذي يحوي كل شيء ===== */}
      <div className="relative z-10 flex items-center justify-center px-[4%] py-20 lg:h-full lg:pb-8 lg:pt-28">
        <div className="ct-panel relative flex w-full max-w-400 flex-col overflow-hidden rounded-3xl border border-gold/25 bg-night-2/90 shadow-2xl shadow-black/50 backdrop-blur-xl lg:h-full lg:max-h-195 lg:flex-row">
          {/* ----- النص والقنوات (يمين) ----- */}
          <div className="relative flex flex-col justify-center p-7 md:p-10 lg:w-[42%] lg:p-12">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-bl from-gold/10 via-transparent to-transparent" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
              style={{ backgroundImage: PATTERN_URL, backgroundSize: "80px 80px" }}
            />

            <div className="relative">
              <div className="ct-in flex items-center gap-4 text-gold">
                <span className="font-serif text-lg tracking-wide">Contact Us</span>
                <span className="h-px w-20 bg-gold/70" />
              </div>

              <h2 className="ct-in mt-4 text-3xl font-bold leading-snug text-sand xl:text-4xl">
                مع رواسي .. نبدأ مستقبلاً أكثر رفاهية
              </h2>

              <p className="ct-in mt-3 max-w-md leading-loose text-sand/70">
                تواصل معنا الآن للحصول على استشارة مجانية من خبرائنا.
              </p>

              <ul className="mt-7 space-y-3">
                {CHANNELS.map(({ icon: Icon, label, value, href, ltr, external }) => (
                  <li key={label} className="ct-in">
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 rounded-2xl border border-gold/20 bg-night/50 p-3 transition-all duration-500 hover:border-gold/50 hover:bg-night/70 hover:shadow-xl hover:shadow-gold/10"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 text-xl text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-night">
                        <Icon />
                      </span>
                      <span>
                        <span className="block text-xs text-sand/60">{label}</span>
                        <span className="block font-semibold text-sand" dir={ltr ? "ltr" : undefined}>
                          {value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}

                <li className="ct-in flex items-center gap-3 px-1 pt-1 text-sm text-sand/60">
                  <FiClock className="text-lg text-gold" />
                  أوقات العمل: {CONTACT.hours}
                </li>
              </ul>
            </div>
          </div>

          {/* فاصل ذهبي رفيع */}
          <div className="h-px w-full bg-linear-to-r from-transparent via-gold/30 to-transparent lg:h-auto lg:w-px lg:bg-linear-to-b" />

          {/* ----- الفورم (يسار) ----- */}
          <div className="ct-in flex-1 p-7 md:p-10 lg:overflow-y-auto lg:p-12">
            {status === "sent" ? (
              <div role="status" className="flex h-full flex-col items-center justify-center py-10 text-center">
                <svg className="ok-item h-20 w-20" viewBox="0 0 52 52" fill="none" aria-hidden="true">
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
                <h3 className="ok-item mt-5 text-2xl font-bold text-gold-light">وصلنا طلبك</h3>
                <p className="ok-item mx-auto mt-2 max-w-xs leading-loose text-sand/70">
                  سيتواصل معك أحد خبرائنا بخصوص ({interest}) خلال 24 ساعة.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="ok-item mt-6 text-sm text-gold underline-offset-4 hover:underline"
                >
                  إرسال طلب آخر
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <h3 className="text-2xl font-bold text-sand">أرسل طلبك</h3>
                <p className="mt-1 text-sm text-sand/60">نرد على جميع الطلبات خلال 24 ساعة.</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field id="ct-name" label="الاسم الكامل" autoComplete="name" {...bind("name")} />
                  <Field
                    id="ct-phone"
                    label="رقم الجوال"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    {...bind("phone")}
                  />
                  <div className="sm:col-span-2">
                    <Field
                      id="ct-email"
                      label="البريد الإلكتروني (اختياري)"
                      type="email"
                      autoComplete="email"
                      {...bind("email")}
                    />
                  </div>
                </div>

                <fieldset className="mt-5">
                  <legend className="mb-2.5 text-sm text-sand/70">أنا مهتم بـ</legend>
                  <div className="flex flex-wrap gap-2.5">
                    {INTERESTS.map((item) => (
                      <label key={item} className="cursor-pointer">
                        <input
                          type="radio"
                          name="interest"
                          value={item}
                          checked={interest === item}
                          onChange={() => setInterest(item)}
                          className="peer sr-only"
                        />
                        <span className="block rounded-full border border-gold/25 px-5 py-2 text-sm text-sand/80 transition-all duration-300 hover:border-gold/60 peer-checked:border-gold peer-checked:bg-gold peer-checked:font-semibold peer-checked:text-night peer-focus-visible:ring-2 peer-focus-visible:ring-gold/60">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-5">
                  <Field
                    id="ct-message"
                    as="textarea"
                    rows={2}
                    label="رسالتك (اختياري)"
                    {...bind("message")}
                  />
                </div>

                {/* فخ للبوتات: مخفي عن المستخدمين */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                {status === "error" && (
                  <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-900/20 px-4 py-3 text-sm text-red-200">
                    تعذر إرسال الطلب. حاول مرة أخرى أو تواصل معنا عبر واتساب.
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-gold px-8 py-3.5 font-semibold text-night transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:translate-y-0 disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-night/30 border-t-night" />
                        جاري الإرسال
                      </>
                    ) : (
                      <>
                        <FiSend />
                        إرسال الطلب
                      </>
                    )}
                  </button>

                  <p className="text-xs text-sand/50">بياناتك محفوظة ولن تُشارك مع أي جهة أخرى.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}

export default ContactCTA;
