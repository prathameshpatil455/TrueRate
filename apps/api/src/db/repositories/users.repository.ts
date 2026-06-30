import { randomUUID } from "node:crypto";
import type { UserProfile } from "@truerate/shared";
import {
  mutateCollection,
  readCollection,
} from "../json-store.js";
import type { StoredUser } from "../storage/types.js";

export function mapUserRow(row: StoredUser): UserProfile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    defaultSourceCurrency: row.defaultSourceCurrency,
    defaultDestCurrency: row.defaultDestCurrency,
    notificationPreferences: row.notificationPreferences ?? {},
  };
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const users = readCollection<StoredUser>("users");
  return users.find((u) => u.email === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string): Promise<UserProfile | null> {
  const users = readCollection<StoredUser>("users");
  const row = users.find((u) => u.id === id);
  return row ? mapUserRow(row) : null;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  name: string;
}): Promise<UserProfile> {
  const now = new Date().toISOString();
  const user: StoredUser = {
    id: randomUUID(),
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    name: input.name,
    defaultSourceCurrency: "USD",
    defaultDestCurrency: "INR",
    notificationPreferences: {},
    createdAt: now,
    updatedAt: now,
  };

  mutateCollection<StoredUser>("users", (users) => [...users, user]);
  return mapUserRow(user);
}

export async function updateUser(
  id: string,
  fields: Partial<{
    name: string;
    defaultSourceCurrency: string;
    defaultDestCurrency: string;
  }>,
): Promise<UserProfile | null> {
  let updated: StoredUser | null = null;

  mutateCollection<StoredUser>("users", (users) =>
    users.map((user) => {
      if (user.id !== id) return user;
      updated = {
        ...user,
        ...fields,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    }),
  );

  return updated ? mapUserRow(updated) : null;
}

export async function updateUserNotificationPreferences(
  id: string,
  preferences: Record<string, unknown>,
): Promise<UserProfile | null> {
  let updated: StoredUser | null = null;

  mutateCollection<StoredUser>("users", (users) =>
    users.map((user) => {
      if (user.id !== id) return user;
      updated = {
        ...user,
        notificationPreferences: {
          ...user.notificationPreferences,
          ...preferences,
        },
        updatedAt: new Date().toISOString(),
      };
      return updated;
    }),
  );

  return updated ? mapUserRow(updated) : null;
}

export async function findUsersWithNotificationFlag(
  flag: keyof StoredUser["notificationPreferences"] & string,
): Promise<Array<{ id: string; email: string; notificationPreferences: Record<string, unknown> }>> {
  const users = readCollection<StoredUser>("users");
  return users
    .filter((u) => u.notificationPreferences?.[flag] === true)
    .map((u) => ({
      id: u.id,
      email: u.email,
      notificationPreferences: u.notificationPreferences,
    }));
}
