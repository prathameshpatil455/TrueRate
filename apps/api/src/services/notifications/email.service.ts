import { randomUUID } from "node:crypto";
import { mutateCollection } from "../../db/json-store.js";
import type { StoredNotificationLog } from "../../db/storage/types.js";

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;

  if (!smtpHost) {
    console.log("[TrueRate Email - dev mode]");
    console.log(`To: ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(payload.text);
    return;
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "notifications@truerate.app",
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
  });
}

export async function logNotification(
  userId: string,
  type: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const entry: StoredNotificationLog = {
    id: randomUUID(),
    userId,
    notificationType: type,
    payload,
    sentAt: new Date().toISOString(),
  };
  mutateCollection<StoredNotificationLog>("notification-logs", (logs) => [
    ...logs,
    entry,
  ]);
}
