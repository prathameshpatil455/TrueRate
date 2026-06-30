import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
const REFRESH_EXPIRES_DAYS = Number(process.env.JWT_REFRESH_EXPIRES_IN?.replace(/\D/g, "")) || 7;

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
}

export function generateRefreshToken(): string {
  return randomBytes(48).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(`${token}${REFRESH_SECRET}`).digest("hex");
}

export function getRefreshTokenExpiry(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + REFRESH_EXPIRES_DAYS);
  return expires;
}

export const REFRESH_COOKIE_NAME = "truerate_refresh";
export const REFRESH_COOKIE_MAX_AGE_MS = REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000;
