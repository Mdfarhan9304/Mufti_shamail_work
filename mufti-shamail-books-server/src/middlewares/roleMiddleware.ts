import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  }

  next();
};

export const moderatorOrAbove = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  const allowedRoles = ["admin", "moderator"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: "Moderator or admin access required",
    });
  }

  next();
};
