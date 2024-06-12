// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import { ThemeProvider } from "@/components/shared/ThemeContext"; // Updated import path
import App from "./App";
import "./globals.css"; // Ensure Tailwind CSS styles are imported here

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <QueryProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
