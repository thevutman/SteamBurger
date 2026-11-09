import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

let memory: MongoMemoryServer;
const app = createApp();

beforeAll(async () => {
  memory = await MongoMemoryServer.create();
  await mongoose.connect(memory.getUri(), { dbName: "steamburger-test" });
}, 120_000);

afterAll(async () => {
  await mongoose.disconnect();
  await memory.stop();
});

const order = (over: Record<string, unknown> = {}) => ({
  customer: { name: "Ana Prueba", phone: "3001234567", address: "Calle 57N #10-55" },
  mode: "domicilio",
  payment: "efectivo",
  items: [
    { productId: "premium-burger", qty: 2 },
    { productId: "gaseosa", qty: 1 },
  ],
  ...over,
});

describe("Steam Burger API", () => {
  it("serves the menu with the 2023 classics", async () => {
    const res = await request(app).get("/api/menu").expect(200);
    const premium = res.body.products.find((p: { id: string }) => p.id === "premium-burger");
    expect(premium.price).toBe(10.9);
    expect(res.body.categories.length).toBeGreaterThan(2);
  });

  it("computes the total on the server and ignores prices sent by the client", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(order({ items: [{ productId: "premium-burger", qty: 2, price: 0.01 }] }))
      .expect(201);
    expect(res.body.subtotal).toBe(21.8);
    expect(res.body.deliveryFee).toBe(2);
    expect(res.body.total).toBe(23.8);
    expect(res.body.code).toMatch(/^SB-/);
    expect(res.body.status).toBe("recibido");
  });

  it("explains what is wrong with an invalid order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(order({ customer: { name: "A", phone: "abc", address: "" }, items: [] }))
      .expect(400);
    expect(res.body.message).toContain("nombre");
    expect(res.body.message).toContain("teléfono");
  });

  it("needs an address only for delivery", async () => {
    await request(app).post("/api/orders").send(order({ customer: { name: "Ana", phone: "3001234567" } })).expect(400);
    await request(app)
      .post("/api/orders")
      .send(order({ mode: "recoger", customer: { name: "Ana", phone: "3001234567" } }))
      .expect(201);
  });

  it("keeps the kitchen behind a token and moves orders through valid steps only", async () => {
    const created = (await request(app).post("/api/orders").send(order()).expect(201)).body;
    await request(app).get("/api/kitchen/orders").expect(401);
    await request(app).post("/api/kitchen/login").send({ password: "nope" }).expect(401);

    const { token } = (await request(app).post("/api/kitchen/demo").expect(200)).body;
    const auth = { Authorization: `Bearer ${token}` };
    const list = await request(app).get("/api/kitchen/orders").set(auth).expect(200);
    expect(list.body.some((o: { _id: string }) => o._id === created._id)).toBe(true);

    // A delivery cannot be marked "listo" (that is for pickup) nor skip straight to "entregado".
    await request(app).patch(`/api/kitchen/orders/${created._id}`).set(auth).send({ status: "entregado" }).expect(409);
    await request(app).patch(`/api/kitchen/orders/${created._id}`).set(auth).send({ status: "preparando" }).expect(200);
    await request(app).patch(`/api/kitchen/orders/${created._id}`).set(auth).send({ status: "listo" }).expect(409);
    await request(app).patch(`/api/kitchen/orders/${created._id}`).set(auth).send({ status: "en-camino" }).expect(200);
    const done = await request(app).patch(`/api/kitchen/orders/${created._id}`).set(auth).send({ status: "entregado" }).expect(200);
    expect(done.body.history.map((h: { status: string }) => h.status)).toEqual(["recibido", "preparando", "en-camino", "entregado"]);

    const tracked = await request(app).get(`/api/orders/${created._id}`).expect(200);
    expect(tracked.body.status).toBe("entregado");
  });
});
