import {
  describe,
  expect,
  it,
} from "vitest";

import {
  classifyOpenEvent,
} from "../../src/services/tracking.service.js";

describe("classifyOpenEvent", () => {
  it("classifies known scanners as PROXY_OR_SCANNER", () => {
    const result = classifyOpenEvent({
      userAgent: "GoogleImageProxy",
      sentAt: new Date(
        "2026-10-03T10:00:00Z"
      ),
      eventTime: new Date(
        "2026-10-03T10:05:00Z"
      ),
    });

    expect(result).toBe(
      "PROXY_OR_SCANNER"
    );
  });

  it("classifies very fast requests as PROXY_OR_SCANNER", () => {
    const result = classifyOpenEvent({
      userAgent: "Mozilla/5.0 Chrome",
      sentAt: new Date(
        "2026-10-03T10:00:00Z"
      ),
      eventTime: new Date(
        "2026-10-03T10:00:03Z"
      ),
    });

    expect(result).toBe(
      "PROXY_OR_SCANNER"
    );
  });

  it("returns UNKNOWN when there is not enough evidence", () => {
    const result = classifyOpenEvent({
      userAgent: "Mozilla/5.0 Chrome",
      sentAt: new Date(
        "2026-10-03T10:00:00Z"
      ),
      eventTime: new Date(
        "2026-10-03T10:05:00Z"
      ),
    });

    expect(result).toBe("UNKNOWN");
  });
});