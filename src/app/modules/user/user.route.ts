import express from "express";
import { authenticateUser, authorizeAdmin } from "../../middlewares/auth";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.get('/',
  authenticateUser,
  authorizeAdmin,
  UserControllers.getAllUsers,
);

router.get('/:id',
  authenticateUser,
  authorizeAdmin,
  UserControllers.getUserById,
);

router.patch('/block/:id',
  authenticateUser,
  authorizeAdmin,
  UserControllers.blockUserBySuperAdmin,
);

router.delete('/:id',
  authenticateUser,
  authorizeAdmin,
  UserControllers.deleteUser,
);

export const UserRoutes = router;