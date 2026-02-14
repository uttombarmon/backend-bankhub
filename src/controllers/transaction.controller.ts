import { Request, Response } from "express";
import { AccountModel } from "../models/account.model";
import { Transaction } from "../models/transaction.model";
import mongoose from "mongoose";
import { Ledger } from "../models/ledger.model";
import { SendTransactionReceivedAmountMail, SendTransactionSuccessMail } from "../services/transaction.service";

export async function transferMoney(req:Request,res:Response) {
    const { fromAccount, toAccount, amount, idempotencyKey} =req.body
    // check if all fields are present
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({message:"All fields are required"})
    }

    // check if accounts are valid
    const fromUserAccount = await AccountModel.findById(fromAccount).populate("user") as any;
    if (!fromUserAccount) {
        return res.status(404).json({message:"From account not found"})
    }
    const toUserAccount = await AccountModel.findById(toAccount).populate("user") as any;
    if (!toUserAccount) {
        return res.status(404).json({message:"To account not found"})
    }

    // check if from and to accounts are same
    if (fromUserAccount._id.toString() === toUserAccount._id.toString()) {
        return res.status(400).json({message:"From and to accounts cannot be the same"})
    }

    // check if accounts are active
    if(fromUserAccount.status !== "active"){
        return res.status(400).json({message:"From account is not active"})
    }
    if(toUserAccount.status !== "active"){
        return res.status(400).json({message:"To account is not active"})
    }


    // check if from account has sufficient balance
    const fromAccountBalance = await fromUserAccount.getCurrentBalance();
    if (fromAccountBalance < amount) {
        return res.status(400).json({message:"Insufficient balance"})
    }

    // check if transaction already exists
    const isTransactionExist = await Transaction.findOne({idempotencyKey})
    if (isTransactionExist) {
        if(isTransactionExist.status === "pending"){
            return res.status(400).json({message:"Transaction is pending"})
        }else if(isTransactionExist.status === "success"){
            return res.status(400).json({message:"Transaction already exists"})
        }else if(isTransactionExist.status === "refunded"){
            return res.status(400).json({message:"Transaction is refunded"})
        }else{
            return res.status(400).json({message:"Transaction is failed"})
        }
    }

    // start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // create transaction
        const [transaction] = await Transaction.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status:"pending"
        }], { session })

        // create ledger entries
        await Ledger.create([{
            account:fromAccount,
            transaction:transaction._id,
            amount:-amount,
            type:"debit"
        }],{session})
        await Ledger.create([{
            account:toAccount,
            transaction:transaction._id,
            amount:amount,
            type:"credit"
        }],{session})

        // update transaction status
        await Transaction.updateOne({_id:transaction._id},{$set:{status:"success"}},{session})

        // send email
        await SendTransactionSuccessMail({
            name:fromUserAccount.user.name as string,
            email:fromUserAccount.user.email as string,
            amount:amount,
            transactionId:transaction._id.toString(),
            date:new Date().toISOString(),
            accountLast4:fromUserAccount.accountNumber.slice(-4),
            currency:fromUserAccount.currency,
            newBalance:fromAccountBalance - amount,
            dashboardUrl:"http://localhost:3000/dashboard"
        })

        // send email to receiver
        await SendTransactionReceivedAmountMail({
            name:toUserAccount.user.name as string,
            email:toUserAccount.user.email as string,
            amount:amount,
            transactionId:transaction._id.toString(),
            date:new Date().toISOString(),
            accountLast4:toUserAccount.accountNumber.slice(-4),
            currency:toUserAccount.currency,
            newBalance:toUserAccount.getCurrentBalance(),
            dashboardUrl:"http://localhost:3000/dashboard",
            senderName:fromUserAccount.user.name as string,
            description:"Transaction"
        })

        // commit transaction
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({message:"Transaction created successfully",transaction})
    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        return res.status(500).json({message:"Internal server error"})
    }
}
export async function initiateTransfer(req:Request,res:Response) {
    const fromAccount = req.user.id
    const { toAccount, amount, idempotencyKey} =req.body
    // check if all fields are present
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({message:"All fields are required"})
    }

    // check if accounts are valid
    const fromUserAccount = await AccountModel.findOne({user:fromAccount}).populate("user") as any;
    if (!fromUserAccount) {
        return res.status(404).json({message:"From account not found"})
    }
    const toUserAccount = await AccountModel.findById(toAccount).populate("user") as any;
    if (!toUserAccount) {
        return res.status(404).json({message:"To account not found"})
    }

    // check if from and to accounts are same
    if (fromUserAccount._id.toString() === toUserAccount._id.toString()) {
        return res.status(400).json({message:"From and to accounts cannot be the same"})
    }

    // check if accounts are active
    if(fromUserAccount.status !== "active"){
        return res.status(400).json({message:"From account is not active"})
    }
    if(toUserAccount.status !== "active"){
        return res.status(400).json({message:"To account is not active"})
    }


    // check if from account has sufficient balance
    // const fromAccountBalance = await fromUserAccount.getCurrentBalance();
    // if (fromAccountBalance < amount) {
    //     return res.status(400).json({message:"Insufficient balance"})
    // }

    // check if transaction already exists
    const isTransactionExist = await Transaction.findOne({idempotencyKey})
    if (isTransactionExist) {
        if(isTransactionExist.status === "pending"){
            return res.status(400).json({message:"Transaction is pending"})
        }else if(isTransactionExist.status === "success"){
            return res.status(400).json({message:"Transaction already exists"})
        }else if(isTransactionExist.status === "refunded"){
            return res.status(400).json({message:"Transaction is refunded"})
        }else{
            return res.status(400).json({message:"Transaction is failed"})
        }
    }

    // start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("start session")
        // create transaction
        const [transaction] = await Transaction.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status:"pending"
        }], { session })

        console.log("transaction created")
        // create ledger entries
        await Ledger.create([{
            account:fromAccount,
            transaction:transaction._id,
            amount:amount,
            type:"debit"
        }],{session})

        console.log("ledger entries created")
        await Ledger.create([{
            account:toAccount,
            transaction:transaction._id,
            amount:amount,
            type:"credit"
        }],{session})

        console.log("ledger entries created")
        // update transaction status
        await Transaction.updateOne({_id:transaction._id},{$set:{status:"success"}},{session})

        console.log("transaction status updated")
        // send email
        await SendTransactionSuccessMail({
            name:fromUserAccount.user.name as string,
            email:fromUserAccount.user.email as string,
            amount:amount,
            transactionId:transaction._id.toString(),
            date:new Date().toISOString(),
            accountLast4:fromUserAccount.accountNumber.slice(-4),
            currency:fromUserAccount.currency,
            newBalance: -amount,
            dashboardUrl:"http://localhost:3000/dashboard"
        })

        console.log("email sent")
        // send email to receiver
        await SendTransactionReceivedAmountMail({
            name:toUserAccount.user.name as string,
            email:toUserAccount.user.email as string,
            amount:amount,
            transactionId:transaction._id.toString(),
            date:new Date().toISOString(),
            accountLast4:toUserAccount.accountNumber.slice(-4),
            currency:toUserAccount.currency,
            newBalance:toUserAccount.getCurrentBalance(),
            dashboardUrl:"http://localhost:3000/dashboard",
            senderName:fromUserAccount.user.name as string,
            description:"Transaction"
        })

        console.log("email sent")
        // commit transaction
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({message:"Transaction created successfully",transaction})
    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        return res.status(500).json({message:"Internal server error"})
    }
}