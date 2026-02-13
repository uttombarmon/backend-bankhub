import { Router } from "express";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware";
import { initiateTransfer, transferMoney } from "../controllers/transaction.controller";

const routerTransaction = Router();

routerTransaction.post("/transfer", authMiddleware, transferMoney);
routerTransaction.post("/admin/initiate-transfer",authMiddleware, adminMiddleware, initiateTransfer);

export default routerTransaction;