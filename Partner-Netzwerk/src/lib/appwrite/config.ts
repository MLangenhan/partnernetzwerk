// Import necessary classes from the Appwrite SDK
import { Client, Account, Databases, Storage, Avatars } from "appwrite";

// Define configuration object for Appwrite
export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL, // URL of your Appwrite instance
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID, // ID of your Appwrite project
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID, // ID of the database you want to use
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID, // ID of the storage bucket you want to use
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID, // ID of the user collection (if applicable)
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID, // ID of the post collection (if applicable)
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID, // ID of the saves collection (if applicable)
};

export const googleConfig = {
  apiKey: import.meta.env.VITE_APPWRITE_GOOGLE_API_KEY,
  calendarId: import.meta.env.VITE_APPWRITE_CALENDAR_ID,
};

console.log("Key:", googleConfig.apiKey)
console.log("URL:", appwriteConfig.url)

// Create a new Appwrite client instance
export const client = new Client();

// Set the Appwrite endpoint URL from the configuration
client.setEndpoint(appwriteConfig.url);

// Set the project ID from the configuration
client.setProject(appwriteConfig.projectId);

// Initialize services with the client instance
export const account = new Account(client); // Account service for user management
export const databases = new Databases(client); // Databases service for data management
export const storage = new Storage(client); // Storage service for file uploads/downloads
export const avatars = new Avatars(client); // Avatars service for profile picture management (optional)
