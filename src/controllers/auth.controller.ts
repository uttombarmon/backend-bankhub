import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CreateUser, findUserByEmail } from "../services/auth.service";
import { IUser } from "../models/user.model";
import { SendRegisterationMail } from "../services/email.service";

/**
 *
 * @param req
 * @param res
 * - User Registration
 * - POST api/v1/auth/register
 */
export async function userRegisterController(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new Error("Missing email or name or password!");
  }
  const exitUser = await findUserByEmail(email);
  if (exitUser) {
    throw new Error("User already exits!");
  }
  const user = await CreateUser({ name, email, password });
  const userObject = user.toObject() as IUser;
  delete userObject.password;
  const payload = { email: userObject.email, id: userObject._id };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  await SendRegisterationMail({ name: user.name, email: user?.email });
  res.cookie("token", token);
  res.status(201).json({
    token,
    success: true,
    user: userObject,
  });
}

/**
 * @param req
 * @param res
 * - User Login
 * - POST api/v1/auth/login
 */
export async function userLoginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Missing email or password!");
    }

    const user = await findUserByEmail(email, password);
    if (!user) {
      return res.status(401).json({ message: "User not registered!" });
    }
    const isMatch = await user.comparePassword(password);
    // console.log(isMatch);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "User not credentials not matched!" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );
    res
      .cookie("token", token)
      .status(200)
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
