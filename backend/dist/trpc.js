import { TRPCError, initTRPC } from "@trpc/server";
import { db } from "./db/index.js";
const isValidAdmin = (username, password) => {
    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedUsername || !expectedPassword)
        return false;
    return username === expectedUsername && password === expectedPassword;
};
export const createContext = async (opts) => {
    const username = opts.req.headers["x-admin-username"];
    const password = opts.req.headers["x-admin-password"];
    const adminUsername = Array.isArray(username) ? username[0] : username;
    const adminPassword = Array.isArray(password) ? password[0] : password;
    return {
        db,
        isAdmin: isValidAdmin(adminUsername, adminPassword)
    };
};
const t = initTRPC.context().create();
export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.isAdmin) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
});
export const validateAdminCredentials = isValidAdmin;
