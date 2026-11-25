import { useEffect, useState } from "react";
import { FiSend, FiChevronDown, FiMenu, FiX } from "react-icons/fi";

const LINKS = [
  { label: "الرئيسية", href: "#home", dropdown: false },
  { label: "العقارات", href: "#properties", dropdown: false },
  { label: "خدماتنا", href: "#services", dropdown: false },
  { label: "من نحن", href: "#about", dropdown: false },
  { label: "المدونة", href: "#footer", dropdown: false },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // تغيير خلفية الناف بار عند النزول
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-aos="fade-down"
      className="fixed inset-x-0 top-0 z-50 px-[5%] py-4"
    >
      <nav
        className={`relative mx-auto flex h-18 max-w-375 items-center justify-between rounded-2xl border border-gold/20 px-5 transition-all duration-500 md:px-8 ${
          scrolled
            ? "bg-night/90 shadow-xl backdrop-blur-xl"
            : "bg-night/40 backdrop-blur-md"
        }`}
      >
        {/* الشعار */}
        <a href="#home" className="flex flex-col items-center leading-none">
          <span className="text-3xl font-bold text-gold-light">رواسي</span>
          <span className="mt-1 font-serif text-[10px] tracking-[0.4em] text-gold">
            RAWASI
          </span>
        </a>

        {/* الروابط */}
        <ul
          className={`absolute inset-x-0 top-full mt-3 flex flex-col gap-1 rounded-2xl border border-gold/20 bg-night/95 p-4 backdrop-blur-xl transition-all duration-300
            md:static md:mt-0 md:flex-row md:gap-10 md:border-0 md:bg-transparent md:p-0 md:opacity-100 md:visible md:translate-y-0 md:backdrop-blur-none
            ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"}`}
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="group relative flex items-center gap-1 py-2 text-[15px] text-sand transition-colors hover:text-gold-light
                  after:absolute after:bottom-0 after:right-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
                {link.dropdown && <FiChevronDown className="text-sm" />}
              </a>
            </li>
          ))}
        </ul>

        {/* زر التواصل + زر القائمة للجوال */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-lg border border-gold bg-gold px-5 py-2.5 text-sm font-semibold text-night transition-all duration-300 hover:-translate-y-0.5 hover:bg-transparent hover:text-gold-light sm:inline-flex"
          >
            <FiSend />
            تواصل معنا
          </a>

          <button
            onClick={() => setOpen(!open)}
            aria-label="القائمة"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/40 text-xl text-gold-light md:hidden"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;