// This line means the code should only be run on the client-side
"use client";

// Inspired by react-hot-toast library
import * as React from "react";

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"; // Assuming this is the path to your Toast component's types

// Defines the maximum number of toasts to be displayed at once
const TOAST_LIMIT = 1;

// Defines the delay in milliseconds before a toast is automatically removed
const TOAST_REMOVE_DELAY = 1000000;

// Interface for a toast with additional properties for internal use
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Defines action types used in the reducer for managing toasts
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

// Counter variable for generating unique toast IDs
let count = 0;

// Function to generate a unique ID for each toast
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Type alias for the action types defined above
type ActionType = typeof actionTypes;

// Union type representing the different actions that can be dispatched
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

// Interface for the state managed by the toast reducer
interface State {
  toasts: ToasterToast[];
}

// Map to store timeouts for automatic toast removal
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Function to add a toast to the removal queue with a delay
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// Reducer function that updates the toast state based on dispatched actions
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // Limits the number of toasts displayed by slicing the array
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      // Updates the toast with the matching ID
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Side effects: schedules removal for the toast(s)
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      // Updates toast "open" property based on ID
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      // If no toastId is provided, remove all toasts
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      // Otherwise, filter toasts and keep only those with IDs different from the provided one
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    // Add other cases for handling different action types...
  }
  return state; // Return unchanged state if no matching action type found
}

// Array to store listener functions for state updates
const listeners: Array<(state: State) => void> = [];

// Initial state with an empty toasts array
let memoryState: State = { toasts: [] };

// Dispatch function to update state and notify listeners
function dispatch(action: Action) {
  // Update state using the reducer
  memoryState = reducer(memoryState, action);
  // Call all listener functions with the updated state
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Type definition for a Toast object (excluding the generated ID)
type Toast = Omit<ToasterToast, "id">;

// Function to create and manage toasts
function toast({ ...props }: Toast) {
  // Generate a unique ID for the toast
  const id = genId();

  // Function to update toast properties
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  // Function to dismiss the toast
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Dispatch an action to add the toast with initial properties
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true, // Set toast to open initially
      onOpenChange: (open) => { // Handle onOpenChange prop
        if (!open) dismiss(); // Dismiss toast if closed
      },
    },
  });

  // Return an object with functions to manage the toast
  return {
    id: id,
    dismiss,
    update,
  };
}

// Custom hook to use toast functionality
function useToast() {
  // Get the state from the global memoryState
  const [state, setState] = React.useState<State>(memoryState);

  // Add a listener function to update the local state whenever memoryState changes
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      // Remove the listener function on cleanup
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  // Return the state with helper functions
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// Export toast creation function and the custom hook
export { useToast, toast };

