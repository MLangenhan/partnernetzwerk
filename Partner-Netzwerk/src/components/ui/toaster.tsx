// This line specifies the client-side rendering library being used (e.g., React, Vue.js).
"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"; // Import Toast components from the UI's toast folder

import { useToast } from "@/components/ui/use-toast"; // Import the useToast hook likely for managing toast state

export function Toaster() {
  // Destructure `toasts` array from the useToast hook, containing toast data
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {/* Loop through each toast object in the `toasts` array */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {/* Conditionally render ToastTitle if a title exists */}
              {title && <ToastTitle>{title}</ToastTitle>}
              {/* Conditionally render ToastDescription if a description exists */}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {/* Renders the provided action component */}
            {action}
            {/* Renders the ToastClose component for dismissing the toast */}
            <ToastClose />
          </Toast>
        );
      })}
      {/* Renders the ToastViewport component, likely for positioning toasts */}
      <ToastViewport />
    </ToastProvider>
  );
}
