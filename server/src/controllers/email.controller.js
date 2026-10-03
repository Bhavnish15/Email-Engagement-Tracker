import prisma from "../config/prisma.js";
import { sendEmailToRecipients } from "../services/email.service.js";
import { buildRecipientAnalytics } from "../services/analytics.service.js";
import { addTrackingToLinks } from "../services/linkTracking.service.js";

export const createEmail = async (req, res) => {
  try {
    const { subject, bodyHtml, recipients } = req.body;

    if (!subject || !bodyHtml) {
      return res.status(400).json({
        success: false,
        message: "Subject and body are required",
      });
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one recipient is required",
      });
    }

    // 1. Create email + recipient database records
    const email = await prisma.email.create({
      data: {
        subject,
        bodyHtml,

        recipients: {
          create: recipients.map((emailAddress) => ({
            emailAddress,
          })),
        },
      },

      include: {
        recipients: true,
      },
    });

    const results = [];

    // 2. Send separately to each recipient
    for (const recipient of email.recipients) {
      try {
        console.log("Sending email to:", recipient.emailAddress);

        const baseUrl = process.env.PUBLIC_API_URL?.replace(/\/$/, "");
        if (!baseUrl) {
          throw new Error("PUBLIC_API_URL is not defined.");
        }
        const trackingUrl = `${baseUrl}/api/track/open/${recipient.trackingToken}.gif`;

        const bodyWithTrackedLinks = await addTrackingToLinks({
          html: email.bodyHtml,
          recipientId: recipient.id,
          baseUrl,
        });

        // Inject tracking pixel into the email body
        const trackedHtml = `
        ${bodyWithTrackedLinks}

        <img
            src="${trackingUrl}"
            height="1"
            width="1"
            alt=""
            style="width:1px;height:1px;border:0;"
        />`;

        console.log("Tracking URL:", trackingUrl);

        const info = await sendEmailToRecipients({
          to: recipient.emailAddress,
          subject: email.subject,
          html: trackedHtml,
        });

        const sentAt = new Date();

        // 3. Mark this recipient as sent
        await prisma.recipient.update({
          where: {
            id: recipient.id,
          },

          data: {
            sentAt,
          },
        });

        results.push({
          recipient: recipient.emailAddress,
          success: true,
          messageId: info.messageId,
          sentAt,
        });
      } catch (error) {
        console.error(
          `Failed to send email to ${recipient.emailAddress}:`,
          error,
        );

        results.push({
          recipient: recipient.emailAddress,

          // IMPORTANT: boolean, not string
          success: false,

          error: error.message,
        });
      }
    }

    // true only if EVERY recipient really succeeded
    const allSent = results.every((result) => result.success === true);

    // 4. Only mark overall email sent when everybody succeeded
    if (allSent) {
      await prisma.email.update({
        where: {
          id: email.id,
        },

        data: {
          sentAt: new Date(),
        },
      });
    }

    return res.status(allSent ? 201 : 207).json({
      success: allSent,

      message: allSent
        ? "Email sent successfully"
        : "Email created but one or more recipients failed",

      emailId: email.id,
      results,
    });
  } catch (error) {
    console.error("Error creating email:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create and send email",
      error: error.message,
    });
  }
};

export const getEmails = async (req, res) => {
  try {
    const emails = await prisma.email.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        recipients: {
          include: {
            openEvents: true,

            trackedLinks: {
              include: {
                clickEvents: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Emails retrieved successfully",
      data: emails,
    });
  } catch (error) {
    console.error("Error retrieving emails:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving emails",
    });
  }
};

// Get analytics for a specific email
export const getEmailAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const email = await prisma.email.findUnique({
      where: {
        id,
      },

      include: {
        recipients: {
          include: {
            openEvents: true,

            trackedLinks: {
              include: {
                clickEvents: true,
              },
            },
          },
        },
      },
    });

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const analytics = email.recipients.map(buildRecipientAnalytics);

    return res.status(200).json({
      success: true,

      data: {
        emailId: email.id,
        subject: email.subject,
        sentAt: email.sentAt,
        recipients: analytics,
      },
    });
  } catch (error) {
    console.error("Error getting analytics:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get email analytics",
    });
  }
};
