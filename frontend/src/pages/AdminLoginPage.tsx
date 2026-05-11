import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/layout/Container";
import { trpc } from "../hooks/trpc";
import { useAdminAuthStore } from "../stores/adminAuthStore";

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const setCredentials = useAdminAuthStore((state) => state.setCredentials);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: (result) => {
      if (!result.ok) {
        setError("Invalid username or password.");
        return;
      }
      setCredentials(username, password);
      navigate("/admin/editor");
    },
    onError: () => setError("Unable to login.")
  });

  return (
    <main className="py-10 sm:py-12">
      <Container>
        <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-900">Admin login</h1>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setError("");
              loginMutation.mutate({ username, password });
            }}
          >
            <div>
              <label className="mb-1 block text-sm text-zinc-700" htmlFor="admin-username">Username</label>
              <input
                id="admin-username"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-700" htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </Container>
    </main>
  );
};
