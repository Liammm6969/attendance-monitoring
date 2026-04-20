import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { submitLog, getMyLogs, getAllLogs, reviewLog } from "../controllers/dailyLog.controller";

const router = Router();

router.post("/", requireAuth, requireRole("student"), submitLog);
router.get("/me", requireAuth, requireRole("student"), getMyLogs);
router.get("/", requireAuth, requireRole("admin"), getAllLogs);
router.put("/:id/review", requireAuth, requireRole("admin"), reviewLog);

export default router;
