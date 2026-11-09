import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { config } from "./config.js";
import { kitchen } from "./routes/kitchen.js";
import { orders } from "./routes/orders.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: config.allowedOrigins }));
  app.use(express.json({ limit: "20kb" }));

  // A small shop does not get thousands of orders a minute; this stops someone flooding the demo.
  app.use("/api/orders", rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false }));
  app.use("/api/kitchen/login", rateLimit({ windowMs: 15 * 60_000, limit: 10 }));

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api", orders);
  app.use("/api", kitchen);

  app.use((_req, res) => res.status(404).json({ message: "Ruta no encontrada" }));
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Algo salió mal en la cocina. Inténtalo de nuevo." });
  });
  return app;
}
