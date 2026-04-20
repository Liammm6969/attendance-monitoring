import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import {
  createCompany, getCompanies, getCompany,
  updateCompany, deleteCompany, assignInternToCompany,
} from "../controllers/company.controller";

const router = Router();

router.get("/", requireAuth, getCompanies);
router.get("/:id", requireAuth, getCompany);
router.post("/", requireAuth, requireRole("admin"), createCompany);
router.put("/:id", requireAuth, requireRole("admin"), updateCompany);
router.delete("/:id", requireAuth, requireRole("admin"), deleteCompany);
router.post("/assign-intern", requireAuth, requireRole("admin"), assignInternToCompany);

export default router;
