import { Router } from "express";
import { userRegisterController } from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.post("/register", userRegisterController);
export default authRouter;
