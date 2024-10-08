import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required!"),
    email: z.string().email("Invalid email address!"),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    role: z.enum(["user", "admin"]).optional().default("user"),
    status: z.enum(["active", "blocked"]).optional().default("active"),
    isDeleted: z.boolean().optional().default(false),
    profileImage: z.string().optional(),
    isPremium: z.boolean().optional().default(false),
    followers: z.array(z.string()).optional(),
    following: z.array(z.string()).optional(),
    bio: z.string().optional(),
    memberShipExpiration: z.date().optional(),
    favouriteRecipeList: z.array(z.string()).optional(),
    socialLinks: z.object({
      instagram: z.string().url().optional(),
      twitter: z.string().url().optional(),
      facebook: z.string().url().optional(),
    }).optional(),
    notificationPreferences: z.object({
      emailNotifications: z.boolean().optional(),
      pushNotifications: z.boolean().optional(),
    }).optional(),
  }),
});

// Define user validation schema for logging in a user
const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address!"),
    password: z.string().min(6, "Password must be at least 6 characters long."),
  }),
});

// Exporting the validation schemas
export const UserValidation = {
  createUserValidationSchema,
  loginUserValidationSchema,
};
