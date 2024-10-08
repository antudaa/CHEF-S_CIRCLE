import { z } from "zod";

// Define the admin validation schema directly for req.body
const createAdminValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required!"),
    email: z.string().email("Invalid email address!"),
    password: z.string().min(6, "Password must be at least 6 characters long!"), 
    profileImage: z.string().optional(),
    role: z.enum(["user", "admin"]).default("admin"),
    status: z.enum(["active", "deactivated", "suspended"]).optional().default("active"),
  })
});

export const AdminValidation = {
  createAdminValidationSchema,
};
