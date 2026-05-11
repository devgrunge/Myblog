import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import "./env.js";
import { db } from "./db/index.js";

const isValidAdmin = (username?: string, password?: string) => {
  const expectedUsername = process.env.ADMIN_USERNAME ?? process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASS;
  const normalizedUsername = username?.trim() ?? "";
  const normalizedPassword = password?.trim() ?? "";
  const normalizedExpectedUsername = expectedUsername?.trim() ?? "";
  const normalizedExpectedPassword = expectedPassword?.trim() ?? "";
  const hasExpectedCredentials = Boolean(normalizedExpectedUsername && normalizedExpectedPassword);
  const isMatch = hasExpectedCredentials && normalizedUsername === normalizedExpectedUsername && normalizedPassword === normalizedExpectedPassword;

  console.info("[admin-auth] credential-check", {
    hasExpectedCredentials,
    hasAdminUsernameEnv: Boolean(process.env.ADMIN_USERNAME ?? process.env.ADMIN_USER),
    hasAdminPasswordEnv: Boolean(process.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASS),
    providedUsernameLength: normalizedUsername.length,
    providedPasswordLength: normalizedPassword.length,
    expectedUsernameLength: normalizedExpectedUsername.length,
    expectedPasswordLength: normalizedExpectedPassword.length,
    isMatch
  });

  return isMatch;
};

export const createContext = async (opts: CreateFastifyContextOptions) => {
  const username = opts.req.headers["x-admin-username"];
  const password = opts.req.headers["x-admin-password"];
  const adminUsername = Array.isArray(username) ? username[0] : username;
  const adminPassword = Array.isArray(password) ? password[0] : password;

  console.info("[admin-auth] context-headers", {
    hasHeaderUsername: Boolean(adminUsername),
    hasHeaderPassword: Boolean(adminPassword),
    usernameLength: (adminUsername ?? "").trim().length,
    passwordLength: (adminPassword ?? "").trim().length
  });

  return {
    db,
    isAdmin: isValidAdmin(adminUsername, adminPassword)
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next();
});
export const validateAdminCredentials = isValidAdmin;
