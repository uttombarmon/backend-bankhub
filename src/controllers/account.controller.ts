import { Request, Response } from "express";
import { AccountModel } from "../models/account.model";
import { generateSecureAccountNumber } from "../services/accountNumberGenerator";

// create account controller
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

// get account controller
export async function getAccount(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const account = await AccountModel.find({ user: userId });
    return res.status(200).json({ account });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

// get balance controller by account id
export async function getBalance(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const account = await AccountModel.findOne({ _id: id });
    const balance = await account?.getCurrentBalance();
    return res.status(200).json({ account: account?.accountNumber, balance: balance });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}