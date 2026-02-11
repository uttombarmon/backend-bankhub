import { Router } from "express";
import {
  userLoginController,
  userRegisterController,
} from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.post("/register", userRegisterController);
authRouter.post("/login", userLoginController);
export default authRouter;
