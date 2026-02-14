import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { findAdminByEmail } from "../services/auth.service";
import { TokenBlacklistModel } from "../models/tokenBlacklist.model";
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  try {
    const tokenBlacklist = await TokenBlacklistModel.findOne({ token });
    if (tokenBlacklist) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    return next();
  } catch (error) {
    // console.log(object);
    return res
      .status(401)
      .json({ message: "Unauthorized access, invalid token!" });
  }
}

export async function adminMiddleware(req:Request,res:Response,next:NextFunction){
    const user = req.user
    const admin = await findAdminByEmail(user.email)
    if(!admin){
        return res.status(403).json({message:"Forbidden access"})
    }
    return next()
}
