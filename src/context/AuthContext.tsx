import { createContext, useContext, useEffect, useState } from "react";
import type{ ReactNode } from "react";
import axiosInstance from "../axios/axiosInstance"
import { refreshToken } from "../utils/utils";

interface AuthContextType {
  token:string | null | undefined,
  user: string | null | undefined;
  isLoading: boolean;
  login: (userData: { email: string; password: string }) => void;
  logout: () => void;
  refreshAccessToken:()=>void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null | undefined>(undefined);
  const [token,setToken] = useState<string | null >()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem("accessToken");
      setToken(storedUser);
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post("http://localhost:4000/auth/login", {
        email: userData.email,
        password: userData.password,
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("accessToken", data.accessToken);
        setUser(userData.email); // Update user state
        setToken(data.accessToken)
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in.");
    }
  };
  async function refreshAccessToken() {
  try {
    const response = await refreshToken()

    if (response.ok) {
      const data = await response.json();
      // Store the new access token
      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken)
      console.log("Access token refreshed");
    } else {
      const errorData = await response.json();
      alert(errorData.message);
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  if (isLoading) {
    return <div>Loading...</div>; // Optional loading UI
  }

  return (
    <AuthContext.Provider value={{ user,token, isLoading, login, refreshAccessToken,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
