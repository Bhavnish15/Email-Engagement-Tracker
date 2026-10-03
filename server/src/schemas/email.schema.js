import { z } from "zod";

export const createEmailSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject cannot exceed 200 characters"),

  bodyHtml: z
    .string()
    .trim()
    .min(1, "Email body is required"),

  recipients: z
    .array(
      z
        .string()
        .trim()
        .email("Invalid recipient email address")
    )
    .min(1, "At least one recipient is required")
    .max(50, "Maximum 50 recipients allowed"),
});