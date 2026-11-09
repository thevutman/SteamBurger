// Downloads the menu photos (public domain / CC0, from Wikimedia Commons) and saves them as
// square WebP in public/menu, plus the wide hero photos in public/hero. Run once: npm run images.
import { access, mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const square = {
  "premium-burger": "Klompus Burger With Bacon and French Fries.jpg",
  "doble-carne": "Cheeseburger.jpg",
  "steam-bbq": "Black Bar Burger Smoky Burger With Lamb Bacon and French Fries.jpg",
  "crispy-chicken": "Fried chicken burger .jpg",
  "veggie": "Chicken cheese burger and Mexican vegetarian burger - Grubbs.jpg",
  "papas": "French fries and spices.jpg",
  "aros-de-cebolla": "Onion rings - Honest Burgers 2025-07-21.jpg",
  "hot-dog": "Oct2023. Hot dog in Cuba.jpg",
  "gaseosa": "Glass cola.jpg",
  "malteada-caramelo": "Salted Caramel Milkshake.jpg",
  "malteada-fresa": "Strawberry milk shake (cropped).jpg",
  "brownie": "Brownie cake with ice cream.jpg",
};

const wide = {
  "combo-1": "Cheeseburger (2).jpg",
  "combo-2": "Cheeseburger and fries 3.jpg",
  "combo-3": "NCI Visuals Food Hamburger.jpg",
};

const ua = { "User-Agent": "steam-burger-portfolio/2.0 (image fetch for a student portfolio)" };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (p) => access(p).then(() => true, () => false);

async function download(file, width) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}${width ? `?width=${width}` : ""}`;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url, { headers: ua });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status !== 429 && width) return download(file, 0);
    await wait(15000 * attempt);
  }
  throw new Error(`No se pudo descargar ${file}`);
}

await mkdir("public/menu", { recursive: true });
await mkdir("public/hero", { recursive: true });

for (const [slug, file] of Object.entries(square)) {
  const out = `public/menu/${slug}.webp`;
  if (await exists(out)) continue;
  const img = await download(file, 1000);
  await writeFile(out, await sharp(img).resize(640, 640, { fit: "cover", position: "attention" }).webp({ quality: 78 }).toBuffer());
  console.log(`✓ ${slug}`);
  await wait(2000);
}

for (const [slug, file] of Object.entries(wide)) {
  const out = `public/hero/${slug}.webp`;
  if (await exists(out)) continue;
  const img = await download(file, 1920);
  await writeFile(out, await sharp(img).resize(1920, 1000, { fit: "cover", position: "attention" }).webp({ quality: 74 }).toBuffer());
  console.log(`✓ ${slug}`);
  await wait(2000);
}
