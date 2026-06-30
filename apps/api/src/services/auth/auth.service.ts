import type { AuthSession, UserProfile } from "@truerate/shared";
import {
  createUser,
  findUserByEmail,
  findUserById,
  mapUserRow,
} from "../../db/repositories/users.repository.js";
import {
  deleteRefreshToken,
  deleteUserRefreshTokens,
  findRefreshToken,
  storeRefreshToken,
} from "../../db/repositories/refresh-tokens.repository.js";
import {
  generateRefreshToken,
  getRefreshTokenExpiry,
  hashPassword,
  hashRefreshToken,
  signAccessToken,
  verifyPassword,
} from "../../lib/auth.js";

function buildSession(user: UserProfile): Omit<AuthSession, "refreshToken"> {
  return {
    user,
    accessToken: signAccessToken({ sub: user.id, email: user.email }),
  };
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
}): Promise<{ session: AuthSession; refreshToken: string }> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser({
    email: input.email,
    passwordHash,
    name: input.name,
  });

  const refreshToken = generateRefreshToken();
  await storeRefreshToken(user.id, hashRefreshToken(refreshToken), getRefreshTokenExpiry());

  return { session: buildSession(user), refreshToken };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ session: AuthSession; refreshToken: string }> {
  const row = await findUserByEmail(input.email);
  if (!row) {
    throw new Error("Invalid email or password");
  }

  const valid = await verifyPassword(input.password, row.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const user = mapUserRow(row);
  await deleteUserRefreshTokens(user.id);

  const refreshToken = generateRefreshToken();
  await storeRefreshToken(user.id, hashRefreshToken(refreshToken), getRefreshTokenExpiry());

  return { session: buildSession(user), refreshToken };
}

export async function refreshSession(
  refreshToken: string,
): Promise<{ session: AuthSession; refreshToken: string } | null> {
  const tokenHash = hashRefreshToken(refreshToken);
  const stored = await findRefreshToken(tokenHash);
  if (!stored) return null;

  const user = await findUserById(stored.userId);
  if (!user) return null;

  await deleteRefreshToken(tokenHash);

  const newRefreshToken = generateRefreshToken();
  await storeRefreshToken(user.id, hashRefreshToken(newRefreshToken), getRefreshTokenExpiry());

  return { session: buildSession(user), refreshToken: newRefreshToken };
}

export async function logoutUser(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  await deleteRefreshToken(hashRefreshToken(refreshToken));
}
