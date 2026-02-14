import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createAccount, getAccount, getBalance } from "../controllers/account.controller";

const accountRouter = Router();

// create account
accountRouter.post("/create", authMiddleware, createAccount);

// get account
accountRouter.get("/", authMiddleware, getAccount);

// get balance
accountRouter.get("/balance", authMiddleware, getBalance);

export default accountRouter;
