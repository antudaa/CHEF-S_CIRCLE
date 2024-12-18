import { Router } from "express";
import { PaymentRoutes } from "../modules/payment/payment.route";
// import { AuthRoutes } from "../modules/Auth/auth.route";
// import { AdminRoutes } from "../modules/Admin/admin.route";
// import { UserRoutes } from "../modules/user/user.route";
import { RecipeRoutes } from "../modules/Recipe/recipe.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { PurchasePremiumAccessRouters } from "../modules/premiumAccess/premiumAccess.route";

const router = Router();

const moduleRoutes = [
  {
    path: `/auth`,
    route: AuthRoutes,
  },
  {
    path: '/purchase-premium',
    route: PurchasePremiumAccessRouters,
  },
  {
    path: `/users`,
    route: UserRoutes,
  },
  {
    path: `/payment`,
    route: PaymentRoutes,
  },
  {
    path: `/recipe`,
    route: RecipeRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
