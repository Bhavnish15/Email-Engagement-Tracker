import * as cheerio from "cheerio";
import prisma from "../config/prisma.js";

export const addTrackingToLinks = async ({html,recipientId,baseUrl}) => {
  const $ = cheerio.load(html, null, false);

  const anchors = $("a[href]").toArray();

  for (const anchor of anchors) {
    const originalUrl = $(anchor).attr("href");

    if (!originalUrl) {
      continue;
    }

    // Only track normal HTTP/HTTPS links
    if (!/^https?:\/\//i.test(originalUrl)) {
      continue;
    }

    const trackedLink = await prisma.trackedLink.create({
      data: {
        recipientId,
        originalUrl,
      },
    });

    const trackingUrl =
      `${baseUrl}/api/track/click/${trackedLink.id}`;

    $(anchor).attr("href", trackingUrl);
  }

  return $.html();
};