import { z } from "zod";
import { procedure, router, validateAdminCredentials } from "../trpc.js";

export const adminRouter = router({
  login: procedure
    .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
    .mutation(({ input }) => {
      const ok = validateAdminCredentials(input.username, input.password);
      return { ok };
    })
});
