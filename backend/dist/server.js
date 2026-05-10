import cors from "@fastify/cors";
import Fastify from "fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { startCronJobs } from "./cron/jobs.js";
import { appRouter } from "./router.js";
import { createContext } from "./trpc.js";
const server = Fastify({ logger: true });
await server.register(cors, {
    origin: true,
    credentials: true
});
await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
        router: appRouter,
        createContext
    }
});
server.get("/health", async () => ({ ok: true }));
startCronJobs();
const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 3001);
const start = async () => {
    try {
        await server.listen({ host, port });
    }
    catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};
await start();
