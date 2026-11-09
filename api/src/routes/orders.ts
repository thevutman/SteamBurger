import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { bus, stream } from "../lib/events.js";
import { categories, DELIVERY_FEE, productById, products } from "../menu.js";
import { Order } from "../models/Order.js";

export const orders = Router();

orders.get("/menu", (_req, res) => {
  res.json({ categories, products, deliveryFee: DELIVERY_FEE });
});

const orderInput = z
  .object({
    customer: z.object({
      name: z.string().trim().min(2, "Escribe tu nombre").max(60),
      phone: z.string().trim().regex(/^[0-9+\s-]{7,20}$/, "Escribe un teléfono válido"),
      address: z.string().trim().max(160).optional().default(""),
    }),
    mode: z.enum(["domicilio", "recoger"]),
    payment: z.enum(["efectivo", "tarjeta"]),
    items: z
      .array(
        z.object({
          productId: z.string(),
          qty: z.number().int().min(1).max(20),
          notes: z.string().trim().max(120).optional().default(""),
        }),
      )
      .min(1, "Tu pedido está vacío")
      .max(30),
  })
  .refine((o) => o.mode === "recoger" || o.customer.address.length >= 5, {
    message: "Escribe la dirección de entrega",
    path: ["customer", "address"],
  });

const round = (n: number) => Math.round(n * 100) / 100;

async function nextCode() {
  for (let i = 0; i < 5; i++) {
    const code = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!(await Order.exists({ code }))) return code;
  }
  return `SB-${Date.now().toString().slice(-6)}`;
}

/** Prices and totals are computed here from the server's menu, never trusted from the client. */
orders.post("/orders", async (req, res) => {
  const parsed = orderInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues.map((i) => i.message).join(". ") });
  }
  const input = parsed.data;
  const unknown = input.items.find((i) => !productById.has(i.productId));
  if (unknown) return res.status(400).json({ message: "Uno de los productos ya no está en el menú" });

  const items = input.items.map((i) => {
    const product = productById.get(i.productId)!;
    return { productId: product.id, name: product.name, price: product.price, qty: i.qty, notes: i.notes };
  });
  const subtotal = round(items.reduce((sum, i) => sum + i.price * i.qty, 0));
  const deliveryFee = input.mode === "domicilio" ? DELIVERY_FEE : 0;

  const order = await Order.create({
    code: await nextCode(),
    customer: input.customer,
    mode: input.mode,
    payment: input.payment,
    items,
    subtotal,
    deliveryFee,
    total: round(subtotal + deliveryFee),
    history: [{ status: "recibido" }],
  });
  const json = order.toJSON();
  bus.emit("kitchen", { type: "created", order: json });
  res.status(201).json(json);
});

orders.get("/orders/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: "Ese pedido no existe" });
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ message: "Ese pedido no existe" });
  res.json(order);
});

/** The customer's tracking page listens here and moves forward as the kitchen updates it. */
orders.get("/orders/:id/stream", async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).end();
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).end();
  stream(res, `order:${req.params.id}`, order);
});

export const productCount = products.length;
