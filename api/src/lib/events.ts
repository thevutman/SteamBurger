import { EventEmitter } from "node:events";
import type { Response } from "express";

/**
 * Live updates without a third-party service: the API keeps the open connections and pushes
 * Server-Sent Events. "order:<id>" reaches the customer tracking that order; "kitchen" reaches
 * every open kitchen board. One instance is enough for a single small server.
 */
export const bus = new EventEmitter();
bus.setMaxListeners(0);

export function stream(res: Response, channel: string, first?: unknown) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  const send = (data: unknown) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  if (first !== undefined) send(first);
  // A comment every 25 s keeps proxies from closing an idle connection.
  const ping = setInterval(() => res.write(": ping\n\n"), 25_000);
  bus.on(channel, send);
  res.on("close", () => {
    clearInterval(ping);
    bus.off(channel, send);
  });
}
