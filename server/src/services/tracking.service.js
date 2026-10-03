export const classifyOpenEvent = ({
  userAgent,
  sentAt,
  eventTime,
}) => {
  const ua = (userAgent || "").toLowerCase();

  // Known proxy/scanner-like identifiers
  const suspiciousAgents = [
    "googleimageproxy",
    "proofpoint",
    "mimecast",
    "barracuda",
    "scanner",
    "bot",
    "crawler",
    "spider",
  ];

  if (
    suspiciousAgents.some((keyword) =>
      ua.includes(keyword)
    )
  ) {
    return "PROXY_OR_SCANNER";
  }

  // Very fast image retrieval after send is suspicious.
  if (sentAt) {
    const differenceMs =
      eventTime.getTime() -
      new Date(sentAt).getTime();

    const differenceSeconds =
      differenceMs / 1000;

    if (differenceSeconds >= 0 && differenceSeconds < 10) {
      return "PROXY_OR_SCANNER";
    }
  }

  // We don't have enough evidence to guarantee a human.
  return "UNKNOWN";
};