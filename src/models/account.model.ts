import mongoose, { Schema, Types } from "mongoose";
import { Ledger } from "./ledger.model";
export enum UserStatus {
  ACTIVE = "active",
  FROZEN = "frozen",
  CLOSED = "closed",
}

export interface IAccount extends Document {
  accountNumber: string;
  user: Types.ObjectId;
  status: UserStatus;
  currency: string;
  getCurrentBalance(): Promise<number>;
}

const accountSchema = new Schema<IAccount>(
  {
    accountNumber: {
      type: String,
      unique: true,
      required: true,
      immutable: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Account must be associated with a user"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(UserStatus),
        message:
          "{VALUE} is not a valid status. Use active, frozen, or closed.",
      },
      default: UserStatus.ACTIVE,
    },
    currency: {
      type: String,
      required: [true, "Currency is required for creating an account"],
      uppercase: true,
      trim: true,
      default: "USD",
    },
  },
  {
    timestamps: true,
  },
);
accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getCurrentBalance = async function () {
  const balance = await Ledger.aggregate([
    {
      $match: {
        account: this._id,
      },
    },
    {
      $group: {
        _id: null,
        balance: {
          $sum:"$amount"
        },
      },
    },
  ]);
return balance.length > 0 ? parseFloat(balance[0].balance.toString()) : 0;
};

export const AccountModel = mongoose.model<IAccount>("Account", accountSchema);
