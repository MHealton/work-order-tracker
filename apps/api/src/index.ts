import { buildApp } from "./app";

const app = await buildApp();
await app.listen({ port: Number(process.env.PORT ?? 3000) });