/** Everything that changes between local and production comes from environment variables. */
export const config = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGODB_URI ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "dev-only-secret-change-me",
  kitchenPassword: process.env.KITCHEN_PASSWORD ?? "cocina-local",
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173,http://localhost:5177")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};
