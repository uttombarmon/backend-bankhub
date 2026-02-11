import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP" });
});

export default app;
