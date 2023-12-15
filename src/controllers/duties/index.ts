import { Request, Response } from "express";
import pool from "../../database";

const getDuties = (req: Request, res: Response) => {
  pool.query("SELECT * FROM duties ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const getDutyById = (req: Request, res: Response) => {
  const id = req.query.id;
  pool.query(`SELECT * FROM duties WHERE id = $1`, [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const createDuty = (req: Request, res: Response) => {
  const { name } = req.body;
  pool.query(
    `INSERT INTO duties (name) VALUES ($1) RETURNING id`,
    [name],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Duty added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateDuty = (req: Request, res: Response) => {
  const id = req.query.id;
  const { name } = req.body;

  pool.query(
    "UPDATE duties SET name = $1 WHERE id = $2",
    [name, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Duty modified with ID: ${id}`);
    }
  );
};

const deleteDuty = (req: Request, res: Response) => {
  const id = req.query.id;

  pool.query(`DELETE FROM duties WHERE id = $1`, [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Duty deleted with ID: ${id}`);
  });
};

export { getDuties, getDutyById, createDuty, updateDuty, deleteDuty };
