import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createEmailSchema,
} from "../../src/schemas/email.schema.js";

describe("createEmailSchema", () => {
  it("accepts a valid email payload", () => {
    const result =
      createEmailSchema.safeParse({
        subject: "Project Update",

        bodyHtml:
          "<h1>Hello</h1>",

        recipients: [
          "test@example.com",
        ],
      });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid recipient email", () => {
    const result =
      createEmailSchema.safeParse({
        subject: "Hello",

        bodyHtml:
          "<p>Test</p>",

        recipients: [
          "this-is-not-an-email",
        ],
      });

    expect(result.success).toBe(false);
  });

  it("rejects an empty recipients list", () => {
    const result =
      createEmailSchema.safeParse({
        subject: "Hello",
        bodyHtml: "<p>Test</p>",
        recipients: [],
      });

    expect(result.success).toBe(false);
  });

  it("rejects an empty subject", () => {
    const result =
      createEmailSchema.safeParse({
        subject: "",
        bodyHtml: "<p>Test</p>",

        recipients: [
          "test@example.com",
        ],
      });

    expect(result.success).toBe(false);
  });
});