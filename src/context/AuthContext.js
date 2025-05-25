"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {username, roles}
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    if (typeof window === "undefined") {
      // Tidak di browser, langsung return
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (formData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data?.message;
      throw new Error(message);
    }
    localStorage.setItem("token", data.data.token);
    await checkAuth(); // Sinkronisasi langsung user setelah login
    router.push("/dashboard");
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
