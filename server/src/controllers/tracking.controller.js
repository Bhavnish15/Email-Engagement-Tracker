import prisma from "../config/prisma.js";
import { classifyOpenEvent } from "../services/tracking.service.js";

// 1x1 pixel tracking image GIF
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
  "base64"
);

const sendTrackingPixel = async (res) => {
  res.set({
    "Content-Type": "image/gif",
    "Content-Length": TRANSPARENT_GIF.length,

    // Try to discourage caching of the tracking pixel
    // Email providers may still cache it, but this is a best-effort approach
    "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });

  return res.status(200).end(TRANSPARENT_GIF);
};

export const trackEmailOpen = async (req, res) => {
  try {
    const { token } = req.params;

    console.log("Tracking pixel requested: ", token);

    const recipient = await prisma.recipient.findUnique({
      where: {
        trackingToken: token,
      },
    });

    if (!recipient) {
      console.error("Recipient not found for token: ", token);

      // Still return the tracking pixel to avoid revealing that the token is invalid
      return sendTrackingPixel(res);
    }

    const userAgent = req.get("user-agent") || null;
    const eventTime = new Date();

    const classification = classifyOpenEvent({
      userAgent,
      sentAt: recipient.sentAt,
      eventTime,
    });

    const openEvent = await prisma.openEvent.create({
      data: {
        recipientId: recipient.id,
        userAgent: userAgent,
        classification: classification,
        timestamp: eventTime,
      },
    });

    console.log(`Open event recorded: ${recipient.emailAddress}`, openEvent.id);

    return sendTrackingPixel(res);
  } catch (error) {
    console.error("Error tracking email open: ", error);

    return sendTrackingPixel(res); // Still return the tracking pixel to avoid revealing that an error occurred
  }
};

export const trackLinkClick = async (req, res) => {
  try {
    const { linkId } = req.params;

    console.log("CLICK ENDPOINT HIT:", linkId);

    const trackedLink = await prisma.trackedLink.findUnique({
      where: {
        id: linkId,
      },

      include: {
        recipient: true,
      },
    });

    if (!trackedLink) {
      console.log("Tracked link not found:", linkId);

      return res.status(404).send("Tracking link not found");
    }

    const clickEvent = await prisma.clickEvent.create({
      data: {
        trackedLinkId: trackedLink.id,
        userAgent: req.get("user-agent") || null,
      },
    });

    console.log("CLICK EVENT CREATED:", {
      clickEventId: clickEvent.id,
      recipient: trackedLink.recipient.emailAddress,
      destination: trackedLink.originalUrl,
    });

    return res.redirect(302, trackedLink.originalUrl);
  } catch (error) {
    console.error("Click tracking error:", error);

    return res
      .status(500)
      .send("Unable to process tracking link");
  }
};
