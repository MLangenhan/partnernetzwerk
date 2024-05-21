import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { getCurrentUser, deleteSession } from "@/lib/appwrite/api"; // Assuming deleteSession is a function to clear sessions

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
  role: [],
  abteilung: "",
  telefon_nr: "",
  linkedin: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  clearSession: async () => {}, // Placeholder for clearSession function
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  clearSession: () => Promise<void>; // Add clearSession type definition
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
          role: currentAccount.role[0] || [],
          abteilung: currentAccount.abteilung,
          telefon_nr: currentAccount.telefon_nr,
          linkedin: currentAccount.linkedin,
        });
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = async () => {
    try {
      await deleteSession(); // Assuming deleteSession handles session clearing
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate("/sign-in");
    }

    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    clearSession, // Add clearSession to the context value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
