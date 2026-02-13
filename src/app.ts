import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import accountRouter from "./routes/account.routes";

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/account", accountRouter);

// health check or test
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP" });
});

export default app;
