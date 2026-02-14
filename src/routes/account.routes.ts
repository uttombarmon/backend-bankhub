import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createAccount, getAccount, getBalance } from "../controllers/account.controller";

const accountRouter = Router();

// create account
accountRouter.post("/create", authMiddleware, createAccount);

// get accounts
accountRouter.get("/", authMiddleware, getAccount);

// get balance
accountRouter.get("/balance/:id", authMiddleware, getBalance);

// get all accounts
// accountRouter.get("/all", authMiddleware, adminMiddleware, getAllAccounts);

export default accountRouter;
