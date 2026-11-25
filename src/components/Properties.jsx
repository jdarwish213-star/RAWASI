import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiArrowLeft } from "react-icons/fi";

import PropertyCard from "./PropertyCard";
import { PROPERTIES } from "../data/properties";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TITLE_WORDS = ["عقارات", "مميزة"];

function Properties() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      tl.from(".prop-label", { opacity: 0, x: 30, duration: 0.8 })
        .from(".prop-line", { scaleX: 0, transformOrigin: "right center", duration: 0.9 }, 0)
        .from(".prop-word", { yPercent: 120, duration: 1, stagger: 0.15 }, 0.2)
        .from(".prop-desc", { opacity: 0, y: 20, duration: 0.8 }, 0.7)
        .from(".prop-btn", { opacity: 0, y: 20, duration: 0.8 }, 0.9)
        .from(
          ".property-card",
          {
            opacity: 0,
            y: 90,
            rotateX: -15,
            transformPerspective: 900,
            duration: 1.1,
            stagger: 0.2,
          },
          0.6
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="properties"
      ref={sectionRef}
      className="relative overflow-hidden bg-night px-[6%] py-24 md:py-32"
    >
      {/* توهج ذهبي خفيف بالخلفية */}
      <div className="pointer-events-none absolute -top-40 right-0 h-125 w-125 rounded-full bg-gold/10 blur-[140px]" />

      <div className="relative mx-auto max-w-325">
        {/* رأس القسم */}
        <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-4 text-gold">
              <span className="prop-label font-serif text-lg tracking-wide">
                Our Properties
              </span>
              <span className="prop-line h-px w-24 bg-gold/70" />
            </div>

            <h2 className="mt-4 flex gap-x-4 text-4xl font-bold text-sand md:text-5xl">
              {TITLE_WORDS.map((word) => (
                <span key={word} className="inline-block overflow-hidden pb-2">
                  <span className="prop-word inline-block">{word}</span>
                </span>
              ))}
            </h2>

            <p className="prop-desc mt-4 max-w-md text-sand/70">
              مجموعة مختارة من أرقى العقارات في أهم المواقع.
            </p>
          </div>

          <a
            href="#properties"
            className="prop-btn inline-flex w-fit items-center gap-3 rounded-full border border-gold px-7 py-3 text-gold-light transition-all duration-300 hover:bg-gold hover:text-night"
          >
            <FiArrowLeft />
            عرض جميع العقارات
          </a>
        </div>

        {/* البطاقات: كل بطاقة بتاخد بياناتها كـ Props */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Properties;