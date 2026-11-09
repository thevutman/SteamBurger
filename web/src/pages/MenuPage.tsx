import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/lib/menu";
import { ErrorBox, SectionTitle } from "./Home";

/** The full menu the 2023 "Mira el menu completo · Aquí" button pointed to, which never existed. */
export function MenuPage() {
  const { menu, error, retry } = useShop();
  if (error) return <div className="pt-20"><ErrorBox message={error} onRetry={retry} /></div>;
  if (!menu) return <p className="pt-40 pb-20 text-center text-smoke">Calentando la plancha…</p>;

  return (
    <main className="pt-16 pb-16 sm:pt-[72px]">
      <nav className="sticky top-0 z-20 flex justify-start gap-2 sm:justify-center overflow-x-auto bg-coal/95 px-4 py-3 backdrop-blur" aria-label="Categorías">
        {menu.categories.map((c) => (
          <a key={c.slug} href={`#${c.slug}`} className="shrink-0 rounded-md border-2 border-wine px-3 py-1.5 text-[15px] font-bold hover:bg-wine">
            {c.name}
          </a>
        ))}
      </nav>
      {menu.categories.map((c) => (
        <section key={c.slug} aria-labelledby={`t-${c.slug}`}>
          <SectionTitle id={c.slug}>{c.name}</SectionTitle>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
            {menu.products.filter((p) => p.category === c.slug).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
