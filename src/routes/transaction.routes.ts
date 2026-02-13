import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { transferMoney } from "../controllers/transaction.controller";

const routerTransaction = Router();

routerTransaction.post("/transfer", authMiddleware, transferMoney);

export default routerTransaction;