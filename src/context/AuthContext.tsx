// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../axios/axiosInstance";
import { isAxiosError } from "axios";

interface AuthContextType {
  token: string | null | undefined;
  user: string | null | undefined;
  isLoading: boolean;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null | undefined>(undefined);
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (userData: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: userData.email,
        password: userData.password,
      });

      const data = response.data; // Axios automatically parses JSON
      localStorage.setItem("accessToken", data.accessToken);
      setUser(userData.email);
      setToken(data.accessToken);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.log(error.response?.data?.message || "Login failed");
      } else {
        console.log("An unexpected error occurred while logging in.");
      }
      console.error("Login error:", error);
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh");
      const data = response.data;
      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken);
      console.log("Access token refreshed");
    } catch (error: unknown) {
      console.error("Error refreshing token:", error);
      if (isAxiosError(error)) {
        console.log(error.response?.data?.message || "Token refresh failed");
      }
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, refreshAccessToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
