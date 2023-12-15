import { Router } from "express";
import {
  getDuties,
  createDuty,
  updateDuty,
  deleteDuty,
  getDutyById,
} from "../controllers/duties";

const router: Router = Router();

router.post("/duties", createDuty);
router.get("/duties", getDuties);
router.get("/duties/:id", getDutyById);
router.put("/duties/:id", updateDuty);
router.delete("/duties/:id", deleteDuty);

export default router;
