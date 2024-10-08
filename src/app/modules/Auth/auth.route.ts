import express from "express";
import requestValidator from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controllert";
import { auth, authenticateUser, authorizeAdmin } from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { AdminValidation } from "../Admin/admin.validation";
import { UserControllers } from "../user/user.controller";
import { UserValidation } from "../user/user.validation";

const router = express.Router();

router.post(
  "/register-admin",
  authenticateUser,
  authorizeAdmin,
  requestValidator(AdminValidation.createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.post(
  "/register-user",
  requestValidator(UserValidation.createUserValidationSchema),
  UserControllers.createUser,
);

router.post(
  "/login",
  requestValidator(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  "/change-password",
  auth(
    USER_ROLE.admin,
    USER_ROLE.user,
  ),
  requestValidator(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post('/refresh-token',
  requestValidator(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,

)

export const AuthRoutes = router;
