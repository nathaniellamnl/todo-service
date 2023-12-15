import dotenv from "dotenv";
dotenv.config();

export const Config = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
};
