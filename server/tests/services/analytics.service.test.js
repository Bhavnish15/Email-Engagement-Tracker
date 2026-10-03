import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildRecipientAnalytics,
} from "../../src/services/analytics.service.js";

describe("buildRecipientAnalytics", () => {
  it("returns NO_OPEN_DETECTED when no events exist", () => {
    const recipient = {
      id: "recipient-1",
      emailAddress: "test@example.com",
      sentAt:
        "2026-10-03T10:00:00Z",

      openEvents: [],
      trackedLinks: [],
    };

    const result =
      buildRecipientAnalytics(recipient);

    expect(
      result.openDetected
    ).toBe(false);

    expect(
      result.observedOpenCount
    ).toBe(0);

    expect(result.status).toBe(
      "NO_OPEN_DETECTED"
    );
  });

  it("calculates first and last observed event", () => {
    const recipient = {
      id: "recipient-1",
      emailAddress: "test@example.com",
      sentAt:
        "2026-10-03T10:00:00Z",

      openEvents: [
        {
          timestamp:
            "2026-10-03T10:10:00Z",
          classification: "UNKNOWN",
        },
        {
          timestamp:
            "2026-10-03T10:05:00Z",
          classification: "UNKNOWN",
        },
      ],

      trackedLinks: [],
    };

    const result =
      buildRecipientAnalytics(recipient);

    expect(
      result.openDetected
    ).toBe(true);

    expect(
      result.observedOpenCount
    ).toBe(2);

    expect(
      result.firstOpenAt
    ).toBe(
      "2026-10-03T10:05:00Z"
    );

    expect(
      result.lastOpenAt
    ).toBe(
      "2026-10-03T10:10:00Z"
    );
  });
});