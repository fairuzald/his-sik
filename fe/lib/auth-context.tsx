"use client";

import { getMyProfileApiProfileMeGet } from "@/sdk/output/sdk.gen";
import { UserProfileDao } from "@/sdk/output/types.gen";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuthToken, removeAuthTokens } from "./auth";

interface AuthContextType {
  user: UserProfileDao | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfileDao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await getMyProfileApiProfileMeGet();
      if (response.data?.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      removeAuthTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthTokens();
    setUser(null);
    router.push("/login");
  };

  const refetchUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        refetchUser,
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
