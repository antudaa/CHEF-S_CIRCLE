import express from "express";
import { authenticateUser } from "../../middlewares/auth";
import { purchasePremiumAccessControllers } from "./premiumAccess.controller";

const router = express.Router();

router.post("/",
    authenticateUser,
    authenticateUser,
    purchasePremiumAccessControllers.purchasePremiumAccess,
)

export const PurchasePremiumAccessRouters = router;