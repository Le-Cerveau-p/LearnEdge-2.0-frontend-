import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { api, type ApiUser } from "../services/api";

interface AuthContextType {
  user: ApiUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "learnedge_user";
const GOOGLE_DEMO_EMAIL = "google-demo@learnedge.local";
const GOOGLE_DEMO_PASSWORD = "google-demo-password";

function readStoredUser() {
  const savedUser = localStorage.getItem(STORAGE_KEY);
  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as ApiUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(() => readStoredUser());

  const persistUser = (nextUser: ApiUser) => {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  };

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    persistUser(response.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await api.signup({ name, email, password });
    persistUser(response.user);
  };

  const loginWithGoogle = async () => {
    try {
      const response = await api.login({
        email: GOOGLE_DEMO_EMAIL,
        password: GOOGLE_DEMO_PASSWORD,
      });
      persistUser(response.user);
      return;
    } catch {
      const response = await api.signup({
        name: "Google Demo",
        email: GOOGLE_DEMO_EMAIL,
        password: GOOGLE_DEMO_PASSWORD,
      });
      persistUser(response.user);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
