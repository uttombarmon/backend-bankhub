import { Request, Response } from "express";
import { AccountModel } from "../models/account.model";
import { generateSecureAccountNumber } from "../services/accountNumberGenerator";

export async function createAccount(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const accountNumber = generateSecureAccountNumber();
    const account = await AccountModel.create({ user: userId, accountNumber });
    return res.status(201).json({ account });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}
