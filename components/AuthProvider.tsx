"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  type AuthResult,
  type LoginInput,
  type RegisterInput,
  type User,
} from "@/lib/auth";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (input: RegisterInput) => AuthResult;
  login: (input: LoginInput) => AuthResult;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      register(input) {
        const result = registerUser(input);

        if (result.ok) {
          setUser(result.user);
        }

        return result;
      },
      login(input) {
        const result = loginUser(input);

        if (result.ok) {
          setUser(result.user);
        }

        return result;
      },
      logout() {
        logoutUser();
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
