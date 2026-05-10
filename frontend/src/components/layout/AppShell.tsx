import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Header />
      {children}
      <Footer />
    </div>
  );
};
