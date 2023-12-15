import { Pool } from "pg";
import { Config } from "../config";

const pool = new Pool({
  connectionString: Config.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
