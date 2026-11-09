import { model, Schema, type InferSchemaType } from "mongoose";

export const STATUSES = ["recibido", "preparando", "listo", "en-camino", "entregado", "cancelado"] as const;
export type Status = (typeof STATUSES)[number];

const itemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    notes: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: "" },
    },
    mode: { type: String, enum: ["domicilio", "recoger"], required: true },
    payment: { type: String, enum: ["efectivo", "tarjeta"], required: true },
    items: { type: [itemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: STATUSES, default: "recibido" },
    history: [{ status: { type: String, enum: STATUSES }, at: { type: Date, default: Date.now }, _id: false }],
    // It is a demo shop: orders clean themselves up after a week.
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
  },
  { versionKey: false },
);

export type OrderDoc = InferSchemaType<typeof orderSchema> & { _id: unknown };
export const Order = model("Order", orderSchema);
