import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BurgerIcon, PauseIcon, PlayIcon } from "./Icons";

const slides = [
  { src: "/hero/combo-1.webp", title: "Premium Burger", line: "La de siempre, con pan brioche y carne madurada" },
  { src: "/hero/combo-2.webp", title: "Arma tu combo", line: "Burger, papas Steam y gaseosa bien fría" },
  { src: "/hero/combo-3.webp", title: "Doble carne", line: "Para los días de mucha hambre" },
];

/**
 * The 2023 banner: a big burger photo, "Pedir ya!" in the middle and, bottom left, the little
 * burger dots with play and pause. Back then the carousel was left commented out in main.js;
 * now it runs, pauses, and every burger dot jumps to its slide.
 */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => window.clearTimeout(id);
  }, [index, playing]);

  return (
    <section className="relative mt-16 h-[60vh] min-h-[380px] overflow-hidden sm:mt-[72px] max-[470px]:h-[45vh]" aria-roledescription="carrusel" aria-label="Promociones">
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
        <p key={index} className="script text-[42px] leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.7)] sm:text-[64px]">
          {slides[index].title}
        </p>
        <p className="font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,.8)]">{slides[index].line}</p>
        <Link to="/menu" className="btn-order mt-2">Pedir ya!</Link>
      </div>
      <ul className="absolute bottom-2 left-3 flex items-center text-white">
        {slides.map((s, i) => (
          <li key={s.src}>
            <button type="button" onClick={() => setIndex(i)} aria-label={`Ver ${s.title}`} aria-current={i === index} className={`p-1.5 transition-opacity ${i === index ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>
              <BurgerIcon />
            </button>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => setPlaying(true)} aria-label="Reproducir" aria-pressed={playing} className={`p-1.5 ${playing ? "opacity-100" : "opacity-50"}`}>
            <PlayIcon />
          </button>
        </li>
        <li>
          <button type="button" onClick={() => setPlaying(false)} aria-label="Pausar" aria-pressed={!playing} className={`p-1.5 ${!playing ? "opacity-100" : "opacity-50"}`}>
            <PauseIcon />
          </button>
        </li>
      </ul>
    </section>
  );
}
