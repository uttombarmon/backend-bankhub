import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createAccount } from "../controllers/account.controller";

const accountRouter = Router();

accountRouter.post("/create", authMiddleware, createAccount);

export default accountRouter;
