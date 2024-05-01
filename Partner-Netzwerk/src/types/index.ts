// This type defines the structure of the data available through the context
export type IContextType = {
  user: IUser; // Currently logged in user information
  isLoading: boolean; // Flag indicating if data is being fetched
  setUser: React.Dispatch<React.SetStateAction<IUser>>; // Function to update user state
  isAuthenticated: boolean; // Flag indicating if user is logged in
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>; // Function to update authentication state
  checkAuthUser: () => Promise<boolean>; // Function to check for a logged-in user
};

// This type defines the structure of a navigation link
export type INavLink = {
    imgURL: string; // URL for the link image
    route: string; // Route path for the link
    label: string; // Text displayed on the link
  };
  
  // This type defines the data required to update a user
export type IUpdateUser = {
    userId: string; // ID of the user to update
    name: string; // Updated name
    bio: string; // Updated bio
    imageId: string; // ID of the user's image (optional)
    imageUrl: URL | string; // URL of the user's image (optional)
    file: File[]; // Files to upload for the user's image (optional)
  };
  
  // This type defines the data required to create a new post
export type INewPost = {
    userId: string; // ID of the user creating the post
    caption: string; // Caption for the post
    file: File[]; // Files to upload for the post content
    location?: string; // Optional location for the post
    tags?: string; // Optional tags for the post
  };
  
  // This type defines the data required to update an existing post
export type IUpdatePost = {
    postId: string; // ID of the post to update
    caption: string; // Updated caption
    imageId: string; // ID of the post's image (optional)
    imageUrl: URL; // URL of the post's image (optional)
    file: File[]; // Files to upload for the post content (optional)
    location?: string; // Optional updated location for the post
    tags?: string; // Optional updated tags for the post
  };
  
  // This type defines the structure of a user object
export type IUser = {
    id: string; // Unique identifier for the user
    name: string; // User's full name
    username: string; // User's login name
    email: string; // User's email address
    imageUrl: string; // URL for the user's profile image
    bio: string; // User's biography
  };
  
  // This type defines the data required to create a new user
export type INewUser = {
    name: string; // User's full name
    email: string; // User's email address
    username: string; // User's desired username
    password: string; // User's password
  };
