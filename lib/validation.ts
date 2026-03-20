import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),

    email: z.string().email("Invalid email address"),

    password: z.string().min(8, "Password must be at least 8 characters long"),

    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const checkoutSchema = z
  .object({
    email: z.string().email("Invalid email"),
    confirmEmail: z.string(),
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    company: z.string().optional(),
    address: z.string().min(1, "Address required"),
    address2: z.string().optional(),
    city: z.string().min(1),
    postal: z.string().min(4),
    country: z.string().min(1),
    state: z.string().min(1),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails do not match",
    path: ["confirmEmail"],
  });
