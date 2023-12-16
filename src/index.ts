import express from "express";
import todoRoutes from "./routes";
import cors from "cors";
import bodyParser from "body-parser";
import { Config } from "./config";
import pool from "./database";
import { HttpError } from "http-errors";
import { Request, Response, NextFunction } from "express";

export const app = express();
const port = Config.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", cors(), todoRoutes);
app.use(
  (err: HttpError, _req: Request, res: Response, _next: NextFunction): void => {
    res.status(err.status || 500);
    const errMessage =
      err.message ??
      (err.status === 404 ? "Duty not found" : "Internal Server Error");
    res.json({
      error: {
        status: err.status || 500,
        message: errMessage,
      },
    });
  }
);


pool.connect((err) => {
  if (err) {
    console.error("Database connection error", err.stack);
    process.exit(1); // Exit the process if the database connection fails
  }
  app.listen(port, () => {
    console.log(`[server]: Server is running at port ${port}`);
  });
});
