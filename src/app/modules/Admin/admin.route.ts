import express from "express";
import { authenticateUser, authorizeAdmin } from "../../middlewares/auth";
import { AdminControllers } from "./admin.controller";

const router = express.Router();

// Get All Admin 
router.get('/',
    authenticateUser,
    authorizeAdmin,
    AdminControllers.getAllAdmin,
);

// Get Admin By ID
router.get('/:id',
    authenticateUser,
    authorizeAdmin,
    AdminControllers.getAdminByID,
);

// Block Admin / User
router.patch('/block/:id',
    authenticateUser,
    authorizeAdmin,
    AdminControllers.blockAdminByID,
);

// Soft Delete Admin / User
router.delete('/delete/:id',
    authenticateUser,
    authorizeAdmin,
    AdminControllers.deleteAdminByID,
);

// Update Admin / User
router.patch('/update/:id',
    authenticateUser,
    authorizeAdmin,
    AdminControllers.updateAdminByID,
);

export const AdminRoutes = router;