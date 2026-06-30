import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/auth.js";
import { findUserById } from "../db/repositories/users.repository.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  try {
    const token = header.slice(7);
    const payload = verifyAccessToken(token);
    const user = await findUserById(payload.sub);
    if (!user) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
      });
      return;
    }
    req.userId = user.id;
    next();
  } catch {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
    });
  }
}

export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(header.slice(7));
    const user = await findUserById(payload.sub);
    if (user) req.userId = user.id;
  } catch {
    // ignore invalid token for optional auth
  }

  next();
}
