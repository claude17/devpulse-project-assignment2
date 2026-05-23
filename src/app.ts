import express, { type Application, type Request, type Response } from "express";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";
import cors from "cors";
import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(logger);

const corsOptions = {
  origin: "http://localhost:7000",
};
app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "devpulse express server",
    author: "devpulse-author",
  });
});

app.use("/api/auth", authRoute);

app.use("/api/issues", issuesRoute);

app.use(globalErrorHandler);

export default app;
