import { timingSafeEqual } from "node:crypto";
import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { config } from "../config.js";
import { issueKitchenToken, requireKitchen } from "../lib/auth.js";
import { bus, stream } from "../lib/events.js";
import { Order, STATUSES, type Status } from "../models/Order.js";

export const kitchen = Router();

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

kitchen.post("/kitchen/login", (req, res) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!same(password, config.kitchenPassword)) return res.status(401).json({ message: "Contraseña incorrecta" });
  res.json({ token: issueKitchenToken(false) });
});

/** Visitors of the portfolio can open the board without the password, to see orders arrive live. */
kitchen.post("/kitchen/demo", (_req, res) => {
  res.json({ token: issueKitchenToken(true) });
});

kitchen.get("/kitchen/orders", requireKitchen, async (_req, res) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  res.json(await Order.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(100).lean());
});

kitchen.get("/kitchen/stream", requireKitchen, (_req, res) => {
  stream(res, "kitchen", { type: "hello" });
});

/** What can follow each status. Pickup orders become "listo", deliveries go "en camino". */
const next: Record<Status, Status[]> = {
  recibido: ["preparando", "cancelado"],
  preparando: ["listo", "en-camino", "cancelado"],
  listo: ["entregado"],
  "en-camino": ["entregado"],
  entregado: [],
  cancelado: [],
};

const statusInput = z.object({ status: z.enum(STATUSES) });

kitchen.patch("/kitchen/orders/:id", requireKitchen, async (req, res) => {
  const parsed = statusInput.safeParse(req.body);
  if (!parsed.success || !isValidObjectId(req.params.id)) return res.status(400).json({ message: "Estado no válido" });
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Ese pedido no existe" });

  const to = parsed.data.status;
  const allowed = next[order.status as Status].filter((s) =>
    order.mode === "recoger" ? s !== "en-camino" : s !== "listo",
  );
  if (!allowed.includes(to)) {
    return res.status(409).json({ message: `Un pedido "${order.status}" no puede pasar a "${to}"` });
  }
  order.status = to;
  order.history.push({ status: to, at: new Date() });
  await order.save();

  const json = order.toJSON();
  bus.emit(`order:${order.id}`, json);
  bus.emit("kitchen", { type: "updated", order: json });
  res.json(json);
});
