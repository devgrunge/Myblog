import { initTRPC } from "@trpc/server";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { db } from "./db/index.js";

export const createContext = async (_opts: CreateFastifyContextOptions) => {
  return { db };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;
