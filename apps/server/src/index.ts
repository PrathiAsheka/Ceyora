import { createApp } from "./app";
import { prisma } from "./db";

const port = Number(process.env.PORT ?? 4000);
const server = createApp().listen(port, () => {
  console.log(`Ceyora360 API listening on http://localhost:${port}/api`);
});

const shutdown = () => {
  server.close(() => void prisma.$disconnect().finally(() => process.exit(0)));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
