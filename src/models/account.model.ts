import mongoose, { Schema, Types } from "mongoose";
export enum UserStatus {
  ACTIVE = "active",
  FROZEN = "frozen",
  CLOSED = "closed",
}

export interface IAccount extends Document {
  user: Types.ObjectId;
  status: UserStatus;
  currency: string;
}

const accountSchema = new Schema<IAccount>(
  {
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

export const AccountModel = mongoose.model<IAccount>("Account", accountSchema);
