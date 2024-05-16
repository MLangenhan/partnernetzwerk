// Import the React library
import React from "react";

// Import the ReactDOM library for interacting with the DOM
import ReactDOM from "react-dom/client";

// Import the BrowserRouter component from react-router-dom for routing
import { BrowserRouter } from "react-router-dom";

// Import AuthProvider component from the context folder at the root of the project (/src/context/AuthContext)
import { AuthProvider } from "@/context/AuthContext";

// Import QueryProvider component from the react-query library for data fetching
import { QueryProvider } from "@/lib/react-query/QueryProvider";

// Import the main App component
import App from "./App";

// Create a root element in the DOM using ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById("root")!);

// Render the React application inside the root element
root.render(
  // Wrap the app with React.StrictMode for development warnings
  <React.StrictMode>
    {/* Enable routing using BrowserRouter */}
    <BrowserRouter>
      {/* Wrap the app with QueryProvider for data fetching functionalities */}
      <QueryProvider>
        {/* Wrap the app with AuthProvider for authentication context */}
        <AuthProvider>
          {/* Render the main App component */}
          <App />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);

