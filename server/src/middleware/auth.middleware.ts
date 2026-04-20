import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (err) return res.status(500).json({ message: "Internal server error" });
    if (!user) return res.status(401).json({ message: "Unauthorized. Please log in." });
    req.user = user;
    next();
  })(req, res, next);
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
    }
    next();
  };
};
