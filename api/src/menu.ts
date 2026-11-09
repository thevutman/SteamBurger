/**
 * The menu. Premium Burger ($10.90), Doble carne ($12.90) and the cola ($2.50) come from the
 * 2023 page; the rest completes a real menu. Prices live here, on the server: the client only
 * sends ids and quantities, so nobody can change what they pay from the browser.
 */
export type Category = { slug: string; name: string };

export type Product = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
};

export const categories: Category[] = [
  { slug: "burgers", name: "Burgers" },
  { slug: "acompanantes", name: "Acompañantes" },
  { slug: "bebidas", name: "Bebidas" },
  { slug: "postres", name: "Postres" },
];

export const products: Product[] = [
  {
    id: "premium-burger",
    category: "burgers",
    name: "Premium Burger",
    description: "Pan brioche, salsa de la casa, lechuga fina, tomate, pepinillos, tocineta y carne de res madurada.",
    price: 10.9,
    image: "/menu/premium-burger.webp",
    tag: "La clásica",
  },
  {
    id: "doble-carne",
    category: "burgers",
    name: "Doble carne",
    description: "Dos carnes de res, doble queso cheddar fundido, lechuga, tomate pequeño y pepinos finos.",
    price: 12.9,
    image: "/menu/doble-carne.webp",
  },
  {
    id: "steam-bbq",
    category: "burgers",
    name: "Steam BBQ",
    description: "Carne ahumada, tocineta crocante, cebolla caramelizada y salsa BBQ hecha en casa.",
    price: 13.5,
    image: "/menu/steam-bbq.webp",
    tag: "Nueva",
  },
  {
    id: "crispy-chicken",
    category: "burgers",
    name: "Crispy Chicken",
    description: "Pechuga apanada y crocante, repollo morado, pepinillos y mayonesa de ajo.",
    price: 11.5,
    image: "/menu/crispy-chicken.webp",
  },
  {
    id: "veggie",
    category: "burgers",
    name: "Veggie",
    description: "Medallón de garbanzo y vegetales, queso, aguacate y pico de gallo.",
    price: 10.5,
    image: "/menu/veggie.webp",
  },
  {
    id: "papas",
    category: "acompanantes",
    name: "Papas Steam",
    description: "Papas a la francesa con sal de especias de la casa.",
    price: 3.9,
    image: "/menu/papas.webp",
  },
  {
    id: "aros-de-cebolla",
    category: "acompanantes",
    name: "Aros de cebolla",
    description: "Aros apanados en cerveza, con salsa tártara.",
    price: 4.5,
    image: "/menu/aros-de-cebolla.webp",
  },
  {
    id: "hot-dog",
    category: "acompanantes",
    name: "Mini hot dog",
    description: "Salchicha ahumada, cebolla crocante, salsa de la casa y papitas.",
    price: 5.9,
    image: "/menu/hot-dog.webp",
  },
  {
    id: "gaseosa",
    category: "bebidas",
    name: "Gaseosa cola",
    description: "750 ml de gaseosa cola bien fría.",
    price: 2.5,
    image: "/menu/gaseosa.webp",
  },
  {
    id: "malteada-caramelo",
    category: "bebidas",
    name: "Malteada de caramelo",
    description: "Helado de vainilla, caramelo salado y crema batida.",
    price: 5.5,
    image: "/menu/malteada-caramelo.webp",
  },
  {
    id: "malteada-fresa",
    category: "bebidas",
    name: "Malteada de fresa",
    description: "Fresas naturales, helado de vainilla y crema.",
    price: 5.5,
    image: "/menu/malteada-fresa.webp",
  },
  {
    id: "brownie",
    category: "postres",
    name: "Brownie con helado",
    description: "Brownie tibio de chocolate con una bola de helado de vainilla.",
    price: 4.9,
    image: "/menu/brownie.webp",
  },
];

export const DELIVERY_FEE = 2;

export const productById = new Map(products.map((p) => [p.id, p]));
