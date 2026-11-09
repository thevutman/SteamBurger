import mongoose from "mongoose";
import { createApp } from "./app.js";
import { config } from "./config.js";

async function main() {
  let uri = config.mongoUri;
  if (!uri) {
    // Local development without Atlas: start an in-memory MongoDB so nothing has to be installed.
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const memory = await MongoMemoryServer.create();
    uri = memory.getUri("steamburger");
    console.log("Sin MONGODB_URI: usando una MongoDB en memoria");
  }
  await mongoose.connect(uri, { dbName: "steamburger" });
  createApp().listen(config.port, () => console.log(`Steam Burger API en el puerto ${config.port}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
