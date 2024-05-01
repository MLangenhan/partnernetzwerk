// Import the default export from the 'react' library
import React from "react";

// Import ReactQueryDevtools named export from the '@tanstack/react-query-devtools' library
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Import both QueryClientProvider and QueryClient named exports from '@tanstack/react-query' library
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Create a new instance of QueryClient for managing data fetching
const queryClient = new QueryClient();

// Define a React component 'QueryProvider' that accepts children as props
export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Wrap the children components with QueryClientProvider
  // This provider makes the 'queryClient' instance available to child components
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Render ReactQueryDevtools component for debugging data fetching */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
