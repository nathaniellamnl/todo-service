import { Request, Response, NextFunction } from "express";
import pool from "../../database";
import { Duty } from "../../types";
import createError from "http-errors";

const getDuties = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const results = await pool.query<Duty>(
      "SELECT * FROM duties ORDER BY id ASC"
    );
    res.status(200).json(results.rows);
  } catch (err) {
    return next(createError(500));
  }
};

const getDutyById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.numericId;
  try {
    const results = await pool.query<Duty>(
      "SELECT * FROM duties WHERE id = $1",
      [id]
    );
    if (results.rows.length === 0) {
      return next(createError(404));
    }
    res.status(200).json(results.rows[0]);
  } catch (err) {
    return next(createError(500));
  }
};

const createDuty = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  try {
    const results = await pool.query<Duty>(
      "INSERT INTO duties (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(results.rows[0]);
  } catch (err) {
    return next(createError(500));
  }
};

const updateDuty = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.numericId;
  const { name } = req.body;
  try {
    const results = await pool.query<Duty>(
      "UPDATE duties SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    res.status(200).json(results.rows[0]);
  } catch (err) {
    return next(createError(500));
  }
};

const deleteDuty = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.numericId;
  try {
    await pool.query<Duty>(`DELETE FROM duties WHERE id = $1`, [id]);
    res.status(200).send(`Duty deleted with ID: ${id}`);
  } catch (err) {
    return next(createError(500));
  }
};

export { getDuties, getDutyById, createDuty, updateDuty, deleteDuty };
