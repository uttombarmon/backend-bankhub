import mongoose, { Schema, Types } from "mongoose";

const ledgerSchema = new Schema({
    
    account: {
        type: Types.ObjectId,
        ref: "Account",
        required: [true,"Account is required"],
        index: true,
        immutable: true
    },
    transaction: {
        type: Types.ObjectId,
        ref: "Transaction",
        required: [true,"Transaction is required"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true,"Amount is required"],
        min: [0.01,"Amount must be greater than 0"],
        immutable: true 
    },
    type: {
        type: String,
        enum: ["credit","debit"],
        required: [true,"Type is required"],
        immutable: true
    },
}, { timestamps: true })
ledgerSchema.index({ account: 1 });
function preventLedgerModification() {
    throw new Error("Ledger cannot be modified");
}

ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);

export const Ledger = mongoose.model("Ledger", ledgerSchema);