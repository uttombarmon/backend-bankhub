import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      reqired: [true, "Must be enter name!"],
    },
    email: {
      type: String,
      required: [true, "Email is reqired for create user!"],
      trim: true,
      lowerCase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address!",
      ],
      unique: [true, "Email already exits!"],
    },
    password: {
      type: String,
      reqiured: [true, "Password is reqired!"],
      minLength: [8, "Password contain 8 or more characters!"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre("save", async function () {
  // if (!this?.isModified("password"))
  //   return
  // }
  const hash = await bcrypt.hash(this.password as string, 10);
  this.password = hash;
});

userSchema.methods.comparePassword = async function name(password: string) {
  return await bcrypt.compare(password, this.password);
};

export const userModel = mongoose.model("User", userSchema);
