import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  company?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  apiKey: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; company?: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const decodeToken = (token: string) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedApiKey = localStorage.getItem("apiKey");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setApiKey(savedApiKey);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem("token", res.token);
    if (res.apiKey) localStorage.setItem("apiKey", res.apiKey);

    const decoded = decodeToken(res.token);
    const userData: User = {
      id: decoded?.userId || "",
      tenantId: decoded?.tenantId || "",
      email,
      name: email.split("@")[0],
      role: "user",
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setToken(res.token);
    setUser(userData);
    if (res.apiKey) setApiKey(res.apiKey);
  };

  const signup = async (data: { name: string; email: string; password: string; company?: string }) => {
    // First register
    await authApi.signup(data);
    // Then login
    await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("apiKey");
    setToken(null);
    setUser(null);
    setApiKey(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, apiKey, isLoading, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
