import { create } from "zustand";

const ADMIN_USERNAME_KEY = "admin.username";
const ADMIN_PASSWORD_KEY = "admin.password";

interface AdminAuthState {
  username: string;
  password: string;
  isAuthenticated: boolean;
  setCredentials: (username: string, password: string) => void;
  logout: () => void;
}

const getStoredUsername = () => localStorage.getItem(ADMIN_USERNAME_KEY) ?? "";
const getStoredPassword = () => localStorage.getItem(ADMIN_PASSWORD_KEY) ?? "";

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  username: getStoredUsername(),
  password: getStoredPassword(),
  isAuthenticated: Boolean(getStoredUsername() && getStoredPassword()),
  setCredentials: (username, password) => {
    localStorage.setItem(ADMIN_USERNAME_KEY, username);
    localStorage.setItem(ADMIN_PASSWORD_KEY, password);
    set({ username, password, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(ADMIN_USERNAME_KEY);
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
    set({ username: "", password: "", isAuthenticated: false });
  }
}));
