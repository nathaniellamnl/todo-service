import { Request, Response, NextFunction } from "express";
import pool from "../../database";
import { Duty } from "../../types";
import createError from "http-errors";

const getDuties = (_: Request, res: Response, next: NextFunction) => {
  pool.query<Duty>("SELECT * FROM duties ORDER BY id ASC", (error, results) => {
    if (error) {
      return next(createError(500));
    }
    res.status(200).json(results.rows);
  });
};

const getDutyById = (
  req: Request,
  res: Response,
  next: NextFunction,
  sendResponse = true
) => {
  const id = req.params.id;
  try {
    const idNum = Number(id);
    if (!idNum) {
      throw new Error();
    }
    pool.query<Duty>(
      `SELECT * FROM duties WHERE id = $1`,
      [idNum],
      (error, results) => {
        if (error) {
          return next(createError(500));
        }
        if (results.rows.length === 0) {
          return next(createError(404));
        }
        if (sendResponse) {
          res.status(200).json(results.rows[0]);
        }
      }
    );
  } catch (err) {
    return next(createError(404));
  }
};

const createDuty = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  if (!name) {
    return next(createError(400, "Name is required"));
  }
  pool.query<Duty>(
    `INSERT INTO duties (name) VALUES ($1) RETURNING id`,
    [name],
    (error, results) => {
      if (error) {
        return next(createError(500));
      }
      res.status(201).json(results.rows[0]);
    }
  );
};

const updateDuty = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name } = req.body;
  if (!name) {
    return next(createError(400, "Name is required"));
  }
  await getDutyById(req, res, next, false);
  pool.query<Duty>(
    "UPDATE duties SET name = $1 WHERE id = $2",
    [name, id],
    (error, _) => {
      if (error) {
        return next(createError(500));
      }
      res.status(200).send(`Duty updated with ID: ${id}`);
    }
  );
};

const deleteDuty = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  await getDutyById(req, res, next, false);
  pool.query<Duty>(`DELETE FROM duties WHERE id = $1`, [id], (error, _) => {
    if (error) {
      return next(createError(500));
    }
    res.status(200).send(`Duty deleted with ID: ${id}`);
  });
};

export { getDuties, getDutyById, createDuty, updateDuty, deleteDuty };
