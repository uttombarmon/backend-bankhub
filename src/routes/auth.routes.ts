import { Router } from "express";
import {
  userLoginController,
  userRegisterController,
  logout,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const authRouter: Router = Router();

authRouter.post("/register", userRegisterController);
authRouter.post("/login", userLoginController);
// logout
authRouter.post("/logout", authMiddleware, logout);
export default authRouter;
