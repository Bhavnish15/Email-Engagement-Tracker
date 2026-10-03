export const buildRecipientAnalytics = (recipient) => {
  const events = recipient.openEvents || [];

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const humanLikeCount = events.filter(
    (event) => event.classification === "HUMAN_LIKE",
  ).length;

  const proxyOrScannerCount = events.filter(
    (event) => event.classification === "PROXY_OR_SCANNER",
  ).length;

  const unknownCount = events.filter(
    (event) => event.classification === "UNKNOWN",
  ).length;

  const clickEvents =
    recipient.trackedLinks?.flatMap((link) => link.clickEvents || []) || [];

  const sortedClicks = [...clickEvents].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  // Define function first
  const calculateDwellEstimate = (events) => {
    const usableEvents = events
      .filter((event) => event.classification !== "PROXY_OR_SCANNER")
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

    if (usableEvents.length < 2) {
      return {
        seconds: null,
        confidence: "INSUFFICIENT_DATA",
      };
    }

    const first = new Date(usableEvents[0].timestamp);

    const last = new Date(usableEvents[usableEvents.length - 1].timestamp);

    const seconds = Math.floor((last.getTime() - first.getTime()) / 1000);

    if (seconds <= 0 || seconds > 1800) {
      return {
        seconds: null,
        confidence: "LOW",
      };
    }

    return {
      seconds,
      confidence: "LOW",
    };
  };

  // Call it OUTSIDE the function
  const dwell = calculateDwellEstimate(events);

  return {
    recipientId: recipient.id,
    emailAddress: recipient.emailAddress,
    sentAt: recipient.sentAt,

    openDetected: events.length > 0,

    firstOpenAt: sortedEvents.length > 0 ? sortedEvents[0].timestamp : null,

    lastOpenAt:
      sortedEvents.length > 0
        ? sortedEvents[sortedEvents.length - 1].timestamp
        : null,

    observedOpenCount: events.length,

    clickDetected: clickEvents.length > 0,

    clickCount: clickEvents.length,

    firstClickAt: sortedClicks.length > 0 ? sortedClicks[0].timestamp : null,

    lastClickAt:
      sortedClicks.length > 0
        ? sortedClicks[sortedClicks.length - 1].timestamp
        : null,

    clickedLinks:
      recipient.trackedLinks
        ?.map((link) => ({
          url: link.originalUrl,
          clickCount: link.clickEvents?.length || 0,
        }))
        .filter((link) => link.clickCount > 0) || [],

    estimatedDwellSeconds: dwell.seconds,
    dwellConfidence: dwell.confidence,

    humanLikeCount,
    proxyOrScannerCount,
    unknownCount,

    status: events.length > 0 ? "OPEN_SIGNAL_DETECTED" : "NO_OPEN_DETECTED",
  };
};
