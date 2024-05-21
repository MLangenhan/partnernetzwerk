import { type ClassValue, clsx } from "clsx"; // Import types and utility function for class names
import { twMerge } from "tailwind-merge";     // Import utility function for Tailwind CSS class merging

// Function to combine classNames with Tailwind merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); // Combine classNames using clsx and merge with Tailwind classes
}

// Function to convert a file object to a URL
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// Function to format a date string in US format with time
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options); // Format date with options

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  }); // Format time with options

  return `${formattedDate} at ${time}`; // Combine formatted date and time
}

// Function to format a timestamp with relative time
export const multiFormatDateString = (timestamp = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp); // Use full format for dates older than a month
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`; // One day ago
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`; // More than a day but less than a month ago
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`; // Within the last hour
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`; // Within the last minute
    default:
      return "Just now"; // Less than a minute ago
  }
};

// Function to check if a user is in a like list
export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId); // Check if user ID exists in the like list
};

// Determine color based on user's role
export const getNameColor = (role: string) => {
  switch (role) {
    case 'Ecurie-Aix':
      console.log(role);
      return 'text-ecurie-lightblue';
    case 'Alumni':
      console.log(role);
      return 'text-ecurie-babyblue';
    case 'Sponsor':
      console.log(role);
      return 'text-ecurie-red';
    case 'Manufacturer':
      console.log(role);
      return 'text-ecurie-darkred';
    default:
      console.log(role);
      return 'text-ecurie-lightblue';
  }
};