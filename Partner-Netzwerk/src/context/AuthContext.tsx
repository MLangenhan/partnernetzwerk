import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types"; // Interface for user data
import { getCurrentUser } from "@/lib/appwrite/api"; // Function to fetch user from Appwrite

// Define initial user object with empty properties
export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

// Define initial state for the context
const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {}, // Placeholder function for setting user
  setIsAuthenticated: () => {}, // Placeholder function for setting auth state
  checkAuthUser: async () => false as boolean, // Placeholder for checking auth
};

// Interface for the AuthContext type
type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>; // Function to update user state
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>; // Function to update auth state
  checkAuthUser: () => Promise<boolean>; // Function to check for authenticated user
};

// Create a React context with the initial state
const AuthContext = createContext<IContextType>(INITIAL_STATE);

// AuthProvider component to manage user context and authentication state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate(); // Get navigation function

  const [user, setUser] = useState<IUser>(INITIAL_USER); // User state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Function to check for authenticated user with Appwrite
  const checkAuthUser = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const currentAccount = await getCurrentUser(); // Fetch user data
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true); // Set authenticated state to true
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false); // Set loading state to false after all operations
    }
  };

  // Check for cookie fallback on initial render and redirect if needed
  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate("/sign-in"); // Redirect to sign-in if cookie is missing
    }

    checkAuthUser(); // Check for authenticated user on component mount
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to access AuthContext from any component
export const useUserContext = () => useContext(AuthContext);
