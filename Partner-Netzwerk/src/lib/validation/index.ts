import * as z from "zod";

// ============================================================
// USER
// ============================================================

// This schema defines the validation rules for user signups
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  // Username should also follow the same validation rule as name.
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.array(z.string()).min(1, "At least one role must be selected")
});

// This schema defines the validation rules for user signins
export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

// This schema defines the validation rules for user profiles
export const ProfileValidation = z.object({
  file: z.custom<File[]>(), // Custom validation for uploaded files can be implemented here. 
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
  telefon_nr: z.string(),
  abteilung: z.string(),
  linkedin: z.string(),
});

// ============================================================
// POST
// ============================================================

// This schema defines the validation rules for posts
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(), // Custom validation for uploaded files can be implemented here. 
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});
