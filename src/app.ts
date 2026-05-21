import express, { type Application, type Request, type Response } from "express";
import { authRoute } from "./modules/auth/auth.route";
const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "devpulse express Server",
    author: "devpulse",
  });
});

app.use("/api/auth", authRoute);

export default app;
