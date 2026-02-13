import { Request, Response } from "express";
import { AccountModel } from "../models/account.model";

export async function createAccount(req: Request, res: Response) {
  try {
    const userId = req.user.id;

    const account = await AccountModel.create({ user: userId });
    return res.status(201).json({ account });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}
