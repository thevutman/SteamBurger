# Steam Burger

**Hamburguesas premium, pedidas en línea y seguidas en vivo.** Steam Burger fue la primera página que
hice, en 2023: una landing en HTML, CSS y JavaScript con el menú, un carrito que no hacía nada y un
carrusel que quedó comentado. En 2026 la convertí en una tienda full stack sin perder su cara: el mismo
rojo, el logo en Dancing Script, la fuente Comfortaa, la franja de "Mira el menú completo" y el
footer rojo con las redes.

## Qué hace

- **Menú** por categorías (burgers, acompañantes, bebidas, postres). Premium Burger, Doble carne y la
  gaseosa conservan los precios de 2023.
- **Carrito** que se guarda en el navegador, con cantidades y subtotal.
- **Pedido** a domicilio o para recoger, con pago al recibir. El total se calcula en el servidor:
  el navegador solo manda productos y cantidades.
- **Seguimiento en vivo**: la página del pedido avanza sola (recibido → en la plancha → en camino o
  listo → entregado) con Server-Sent Events.
- **Panel de la cocina** (`/cocina`): los pedidos llegan en tiempo real y el cocinero los mueve de
  columna. Tiene contraseña, y un modo demo para quien visita el portafolio.
- **El carrusel** del banner por fin funciona, con sus hamburguesitas y play/pausa.

## Stack

| Capa | Tecnología |
| --- | --- |
| API | Node 22, Express 5, TypeScript, Mongoose, Zod, JWT, Helmet, rate limiting |
| Tiempo real | Server-Sent Events (sin servicios externos) |
| Base de datos | MongoDB Atlas (base `steamburger`) · MongoDB en memoria en local y en pruebas |
| Front-end | React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7 |
| Pruebas | Vitest + Supertest contra MongoDB real en memoria |
| Publicación | Render (API) · Vercel (front-end) |

## Correr en local

```bash
cd api && npm install && npm run dev      # API en http://localhost:3000 (sin MONGODB_URI usa Mongo en memoria)
cd web && npm install && cp .env.example .env.local && npm run dev   # http://localhost:5173
```

Pruebas: `cd api && npm test`. Contraseña local de la cocina: `cocina-local`.

## API

| Método | Ruta | Acceso |
| --- | --- | --- |
| `GET` | `/api/menu` | Público |
| `POST` | `/api/orders` | Público (máx. 20 por minuto) |
| `GET` | `/api/orders/:id` · `/api/orders/:id/stream` | Quien tiene el enlace del pedido |
| `POST` | `/api/kitchen/login` · `/api/kitchen/demo` | Público |
| `GET` | `/api/kitchen/orders` · `/api/kitchen/stream` | Cocina (JWT) |
| `PATCH` | `/api/kitchen/orders/:id` | Cocina (JWT), solo pasos válidos |

Los pedidos son de demostración y se borran solos a los 7 días.

## Créditos

Fotos de dominio público y CC0 de [Wikimedia Commons](https://commons.wikimedia.org) (lista exacta en
`web/scripts/fetch-images.mjs`). El dibujo de la salsa (`salsa.svg`) es el original de 2023.
