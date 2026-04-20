import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { signup, login, forgotPassword, resetPassword, verifySignupOtp, adminResetPassword, getMe } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/verify-signup-otp", verifySignupOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", requireAuth, getMe);

const authenticateLocal = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", { session: false }, (err: any, user: any, info: any) => {
    if (err) return res.status(500).json({ message: "Internal server error" });
    if (!user) return res.status(401).json({ message: info?.message || "Invalid email or password" });
    req.user = user;
    next();
  })(req, res, next);
};

router.post("/login", authenticateLocal, login);

// Dev only
router.post("/admin/reset-password", adminResetPassword);

export default router;