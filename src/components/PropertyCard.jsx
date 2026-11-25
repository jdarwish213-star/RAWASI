import { useRef, useState } from "react";
import gsap from "gsap";
import { FiMapPin, FiHeart } from "react-icons/fi";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";

function PropertyCard({ title, location, price, beds, baths, tag, image }) {
  const innerRef = useRef(null);
  const heartRef = useRef(null);
  const [liked, setLiked] = useState(false);

  const isSold = tag === "مباع";

  // ميلان 3D حسب مكان الماوس
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(innerRef.current, {
      rotateY: x * 12,
      rotateX: -y * 12,
      transformPerspective: 900,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    gsap.to(innerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  };

  // حركة القلب
  const toggleLike = () => {
    setLiked((v) => !v);
    gsap.fromTo(
      heartRef.current,
      { scale: 0.5 },
      { scale: 1, duration: 0.6, ease: "back.out(3)" }
    );
  };

  return (
    <div
      className="property-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        ref={innerRef}
        className="group relative h-110 overflow-hidden rounded-3xl border border-gold/20 bg-night-2 shadow-xl shadow-black/30 transition-shadow duration-500 hover:border-gold/50 hover:shadow-gold/10"
      >
        {/* الصورة */}
        <img
          src={image}
          alt={title}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            isSold ? "grayscale-40" : ""
          }`}
        />

        {/* تدرج لقراءة النص */}
        <div className="absolute inset-0 bg-linear-to-t from-night via-night/50 to-transparent" />

        {/* الوسم */}
        <span
          className={`absolute right-4 top-4 rounded-full px-4 py-1 text-sm font-semibold backdrop-blur-md ${
            isSold
              ? "bg-red-900/70 text-red-100"
              : "bg-night/70 text-gold-light"
          }`}
        >
          {tag}
        </span>

        {/* القلب */}
        <button
          onClick={toggleLike}
          aria-label="أضف للمفضلة"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-night/60 text-xl text-sand backdrop-blur-md transition-colors hover:text-gold-light"
        >
          <FiHeart
            ref={heartRef}
            className={liked ? "fill-gold text-gold" : ""}
          />
        </button>

        {/* التفاصيل */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="text-2xl font-bold text-sand">{title}</h3>

          <p className="mt-1 flex items-center gap-1 text-sm text-sand/70">
            <FiMapPin className="text-gold" />
            {location}
          </p>

          <p className="mt-3 text-xl font-semibold text-gold-light">{price}</p>

          <div className="mt-4 flex items-center gap-6 border-t border-gold/20 pt-4 text-sm text-sand/80">
            <span className="flex items-center gap-2">
              <IoBedOutline className="text-lg text-gold" />
              {beds} غرف
            </span>
            <span className="flex items-center gap-2">
              <LuBath className="text-lg text-gold" />
              {baths} حمامات
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;