import { initTRPC } from "@trpc/server";
import { db } from "./db/index.js";
export const createContext = async (_opts) => {
    return { db };
};
const t = initTRPC.context().create();
export const router = t.router;
export const procedure = t.procedure;
