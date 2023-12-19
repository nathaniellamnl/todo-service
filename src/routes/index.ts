import { NextFunction, Request, Response, Router } from "express";
import {
  getDuties,
  createDuty,
  updateDuty,
  deleteDuty,
  getDutyById,
} from "../controllers/duties";
import createError from "http-errors";
import pool from "../database";
import { Duty } from "../types";

declare global {
  namespace Express {
    interface Request {
      numericId?: number;
    }
  }
}
const router: Router = Router();

const convertIdToNumber = (req: Request, _: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(createError(404));
  }
  req.numericId = id;
  next();
};

const validateId = async (req: Request, _: Response, next: NextFunction) => {
  const id = req.numericId;

  try {
    const results = await pool.query<Duty>(
      `SELECT * FROM duties WHERE id = $1`,
      [id]
    );
    if (results.rows.length === 0) {
      return next(createError(404));
    }
  } catch (err) {
    return next(createError(500));
  }
  next();
};

const validateRequestData = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  if (!name) {
    return next(createError(400, "Name is required"));
  }
};

router.post("/duties", validateRequestData, createDuty);
router.get("/duties", getDuties);
router.use("/duties/:id", convertIdToNumber);
router.get("/duties/:id", getDutyById);
router.put("/duties/:id", validateId, validateRequestData, updateDuty);
router.delete("/duties/:id", validateId, deleteDuty);

export default router;
