import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import {
  timeIn, timeOut, getTodayAttendance,
  getMyAttendance, getAttendanceSummary, getAllInterns,
} from "../controllers/attendance.controller";

const router = Router();

router.post("/time-in", requireAuth, requireRole("student"), timeIn);
router.post("/time-out", requireAuth, requireRole("student"), timeOut);
router.get("/today", requireAuth, getTodayAttendance);
router.get("/me", requireAuth, requireRole("student"), getMyAttendance);
router.get("/interns", requireAuth, requireRole("admin"), getAllInterns);
router.get("/summary/:userId", requireAuth, getAttendanceSummary);

export default router;
