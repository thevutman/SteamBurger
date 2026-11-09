import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function issueKitchenToken(demo: boolean) {
  return jwt.sign({ role: "kitchen", demo }, config.jwtSecret, { expiresIn: "12h" });
}

/** Kitchen routes accept the token as a Bearer header, or as ?token= for EventSource streams. */
export function requireKitchen(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : (req.query.token as string | undefined);
  if (!token) return res.status(401).json({ message: "Entra al panel de la cocina para continuar" });
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { role?: string };
    if (payload.role !== "kitchen") throw new Error("role");
    next();
  } catch {
    res.status(401).json({ message: "La sesión de la cocina expiró, vuelve a entrar" });
  }
}
