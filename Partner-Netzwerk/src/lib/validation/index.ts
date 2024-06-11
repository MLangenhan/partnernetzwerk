import * as z from "zod";

// ============================================================
// USER
// ============================================================

// This schema defines the validation rules for user signups
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name muss mindestens 2 Zeichen enthalten." }),
  // Username should also follow the same validation rule as name.
  username: z.string().min(2, { message: "Unternehmensname muss mindestens 2 Zeichen enthalten." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Passwort muss mindestens 8 Zeichen lang sein." }),
  role: z.array(z.string()).min(1, "Es muss mindestens eine Rolle ausgewählt sein.")
});

// This schema defines the validation rules for user signins
export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Passwort muss mindestens 8 Zeichen lang sein." }),
});

// This schema defines the validation rules for user profiles
export const ProfileValidation = z.object({
  file: z.custom<File[]>(), // Custom validation for uploaded files can be implemented here. 
  name: z.string().min(2, { message: "Name muss mindestens 2 Zeichen enthalten.." }),
  username: z.string().min(2, { message: "Unternehmensname muss mindestens 2 Zeichen enthalten.." }),
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
  caption: z.string().min(5, { message: "Bildunterschrift muss mindestens 5 Zeichen lang sein." }).max(2200, { message: "Bildunterschrift darf höchstens 2200 Zeichen lang sein." }),
  file: z.custom<File[]>(), // Custom validation for uploaded files can be implemented here. 
  location: z.string().min(1, { message: "Notwendiges Feld." }).max(1000, { message: "Höchstens 1000 Zeichen." }),
  tags: z.string(),
});
