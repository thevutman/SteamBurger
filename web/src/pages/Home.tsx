import { Link } from "react-router-dom";
import salsa from "@/assets/salsa.svg";
import { MenuBanner } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/lib/menu";

/** A section title like 2023's "Burgers" / "Bebidas", with the sauce drip from salsa.svg under it. */
export function SectionTitle({ children, id }: { children: string; id?: string }) {
  return (
    <div id={id} className="px-4 pt-8 pb-4 sm:px-8">
      <h2 className="text-[30px] font-bold max-[470px]:text-[24px]">{children}</h2>
      <img src={salsa} alt="" className="mt-1 h-5 w-auto" />
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <p className="script text-[34px]">Se nos apagó la plancha</p>
      <p className="text-[15px] text-smoke">{message}</p>
      <button type="button" className="btn-red" onClick={onRetry}>Intentar de nuevo</button>
    </div>
  );
}

export function Home() {
  const { menu, error, retry } = useShop();
  const featured = ["premium-burger", "doble-carne", "steam-bbq"];
  const drinks = ["gaseosa", "malteada-caramelo"];

  return (
    <>
      <Hero />
      <main className="pb-8">
        {error ? <ErrorBox message={error} onRetry={retry} /> : null}
        {!menu && !error ? <p className="py-20 text-center text-smoke">Calentando la plancha…</p> : null}
        {menu ? (
          <>
            <SectionTitle id="burgers">Burgers</SectionTitle>
            <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
              {featured.map((id) => menu.products.find((p) => p.id === id)).map((p) => (p ? <ProductCard key={p.id} product={p} /> : null))}
            </div>
            <SectionTitle>Bebidas</SectionTitle>
            <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
              {drinks.map((id) => menu.products.find((p) => p.id === id)).map((p) => (p ? <ProductCard key={p.id} product={p} /> : null))}
            </div>
            <p className="mt-10 text-center">
              <Link to="/menu" className="btn-red">Ver el menú completo</Link>
            </p>
          </>
        ) : null}
      </main>
      <MenuBanner />
    </>
  );
}
