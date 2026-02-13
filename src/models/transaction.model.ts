import mongoose, { Schema, Types } from "mongoose";

const transactionSchema = new Schema({
    fromAccount: {
        type: Types.ObjectId,
        ref: "Account",
        required: [true,"From account is required"],
        index: true
    },
    toAccount: {
        type: Types.ObjectId,
        ref: "Account",
        required: [true,"To account is required"],
        index: true
    },
    amount: {
        type: Number,
        required: [true,"Amount is required"],
        min: [0.01,"Amount must be greater than 0"]
    },
    idempotencyKey: {
        type: String,
        required: [true,"Idempotency key is required"],
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ["pending","success","failed","refunded"],
        default: "pending",
        index: true
    },
}, { timestamps: true })

export const Transaction = mongoose.model("Transaction", transactionSchema);