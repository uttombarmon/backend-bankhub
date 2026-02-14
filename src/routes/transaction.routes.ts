import { Router } from "express";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware";
import { initiateTransfer, transferMoney } from "../controllers/transaction.controller";

const routerTransaction = Router();

routerTransaction.post("/create", authMiddleware, transferMoney);
routerTransaction.post("/admin/initiate",authMiddleware, adminMiddleware, initiateTransfer);

export default routerTransaction;