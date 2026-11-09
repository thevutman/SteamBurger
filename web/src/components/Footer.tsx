import { Link } from "react-router-dom";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./Icons";

/** "Mira el menu completo" on the doodle pattern with its peach strip and beige "Aquí" button. */
export function MenuBanner() {
  return (
    <section className="flex h-[400px] flex-col items-center justify-center gap-5 bg-[url(/doodles.svg)] bg-[length:240px] text-center" aria-label="Menú completo">
      <p className="w-full bg-peach py-2 text-[clamp(26px,5vw,40px)] font-bold text-black">Mira el menu completo</p>
      <Link to="/menu" className="btn-beige">Aquí</Link>
    </section>
  );
}

const socials = [
  { name: "TikTok", Icon: TikTokIcon, hover: "hover:bg-black" },
  { name: "Facebook", Icon: FacebookIcon, hover: "hover:bg-blue-600" },
  { name: "Instagram", Icon: InstagramIcon, hover: "hover:bg-[rgb(148,55,181)]" },
];

/** The red 2023 footer: Contacto, the address, the phone and the three round social buttons. */
export function Footer() {
  return (
    <footer id="contacto" className="bg-red px-4 pt-6 pb-4 text-center">
      <h2 className="p-2 text-[28px] font-bold">Contacto</h2>
      <p className="text-[14px]">Dir: Calle 57N #10-55</p>
      <p className="text-[14px]">Tel: 302 445 2187</p>
      <p className="mt-1 text-[14px]">Lunes a domingo · 12:00 m. a 10:00 p. m.</p>
      <h4 className="mt-3 text-[20px] font-bold">Síguenos en nuestras redes sociales</h4>
      <ul className="flex justify-center">
        {socials.map(({ name, Icon, hover }) => (
          <li key={name} className="m-5">
            <span className={`grid h-10 w-10 place-items-center rounded-full bg-wine transition-colors ${hover}`} role="img" aria-label={name}>
              <Icon />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[12px] text-white/75">
        Proyecto de portafolio de{" "}
        <a href="https://thevutman.github.io" className="underline hover:text-white">Santiago Velasco</a>. Los pedidos son de demostración:
        no llegan hamburguesas de verdad. ·{" "}
        <Link to="/cocina" className="underline hover:text-white">Panel de la cocina</Link>
      </p>
    </footer>
  );
}
