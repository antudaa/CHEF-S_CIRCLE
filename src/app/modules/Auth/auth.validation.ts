import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required!",
    }).email("Invalid email address!"),
    password: z.string({ required_error: "Password is required!" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required!" }),
    newPassword: z.string({ required_error: "New password is required!" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required!',
    }).min(1, "Refresh Token cannot be empty!"),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
