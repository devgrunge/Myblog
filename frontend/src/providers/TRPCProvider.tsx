import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useMemo, useState, type ReactNode } from "react";
import { trpc } from "../hooks/trpc";
import { useAdminAuthStore } from "../stores/adminAuthStore";

export const TRPCProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const username = useAdminAuthStore((state) => state.username);
  const password = useAdminAuthStore((state) => state.password);

  const trpcClient = useMemo(() => trpc.createClient({
    links: [
      httpBatchLink({
        url: `${import.meta.env.VITE_API_URL ?? "http://localhost:3001"}/trpc`,
        headers: () => ({
          "x-admin-username": username,
          "x-admin-password": password
        })
      })
    ]
  }), [username, password]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
