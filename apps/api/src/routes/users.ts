import { Router } from "express";
import {
  findUserById,
  updateUser,
  updateUserNotificationPreferences,
} from "../db/repositories/users.repository.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await findUserById(req.userId!);
  if (!user) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    return;
  }

  res.json({ data: user });
});

usersRouter.patch("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const body = req.body as Record<string, unknown>;

  let user = await updateUser(req.userId!, {
    name: body.name !== undefined ? String(body.name) : undefined,
    defaultSourceCurrency:
      body.defaultSourceCurrency !== undefined
        ? String(body.defaultSourceCurrency)
        : undefined,
    defaultDestCurrency:
      body.defaultDestCurrency !== undefined
        ? String(body.defaultDestCurrency)
        : undefined,
  });

  if (body.notificationPreferences && typeof body.notificationPreferences === "object") {
    user = await updateUserNotificationPreferences(
      req.userId!,
      body.notificationPreferences as Record<string, unknown>,
    );
  }

  if (!user) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    return;
  }

  res.json({ data: user });
});
