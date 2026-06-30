import { Router } from "express";
import { authRateLimit } from "../middleware/rate-limit.js";
import { clearRefreshCookie, setRefreshCookie } from "../lib/cookies.js";
import { REFRESH_COOKIE_NAME } from "../lib/auth.js";
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from "../services/auth/auth.service.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/register", authRateLimit, async (req, res) => {
  const { email, password, name } = req.body as Record<string, unknown>;

  if (!email || !password || !name) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "email, password, and name are required" },
    });
    return;
  }

  if (String(password).length < 8) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Password must be at least 8 characters" },
    });
    return;
  }

  try {
    const { session, refreshToken } = await registerUser({
      email: String(email),
      password: String(password),
      name: String(name),
    });
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ data: session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    res.status(400).json({ error: { code: "REGISTRATION_ERROR", message } });
  }
});

authRouter.post("/login", authRateLimit, async (req, res) => {
  const { email, password } = req.body as Record<string, unknown>;

  if (!email || !password) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "email and password are required" },
    });
    return;
  }

  try {
    const { session, refreshToken } = await loginUser({
      email: String(email),
      password: String(password),
    });
    setRefreshCookie(res, refreshToken);
    res.json({ data: session });
  } catch {
    res.status(401).json({
      error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
    });
  }
});

authRouter.post("/refresh", authRateLimit, async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
  if (!refreshToken) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Refresh token missing" },
    });
    return;
  }

  const result = await refreshSession(refreshToken);
  if (!result) {
    clearRefreshCookie(res);
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid or expired refresh token" },
    });
    return;
  }

  setRefreshCookie(res, result.refreshToken);
  res.json({ data: { accessToken: result.session.accessToken, user: result.session.user } });
});

authRouter.post("/logout", requireAuth, async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
  await logoutUser(refreshToken);
  clearRefreshCookie(res);
  res.json({ data: { success: true } });
});
