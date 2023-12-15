import express from "express";
import todoRoutes from "./routes";
import cors from "cors";
import bodyParser from "body-parser";
import { Config } from "./config";
import { Pool } from "pg";

const app = express();
const port = Config.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(todoRoutes);

const pool = new Pool({
  connectionString: Config.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection error", err.stack);
    process.exit(1); // Exit the process if the database connection fails
  }
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});
