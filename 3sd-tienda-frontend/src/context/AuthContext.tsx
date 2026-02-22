"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  Customer,
  loginCustomer,
  registerCustomer,
  logoutCustomer,
  getMe,
} from "../services/auth";

import { getCustomerDiscount } from "../services/dolibarr";

interface AuthContextType {
  user: Customer | null;
  discount: number;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phone?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((u) => {
        setUser(u);
        if (u && u.email) {
          getCustomerDiscount(u.email).then((d) => setDiscount(d));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginCustomer(email, password);
    setUser(data.user);

    // Al hacer login, buscamos el descuento y lo guardamos en el estado
    const disc = await getCustomerDiscount(data.user.email);
    setDiscount(disc);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string, phone?: string) => {
      await registerCustomer(email, password, name, phone);
      // Auto-login after registration
      const data = await loginCustomer(email, password);
      setUser(data.user);

      // Al registrar, comprobmos si ya existe en el ERP
      const disc = await getCustomerDiscount(data.user.email);
      setDiscount(disc);
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutCustomer();
    setUser(null);
    setDiscount(0); // Reseteamos el descuento al hacer logout
  }, []);

  return (
    <AuthContext.Provider value={{ user, discount, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
