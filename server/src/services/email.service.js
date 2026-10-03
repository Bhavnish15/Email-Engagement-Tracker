import transporter from "../config/mailer.js";

export const sendEmailToRecipients = async ({to, subject, html}) => {

    console.log("SERVICE TO:", to);
    console.log("SERVICE SUBJECT:", subject);

    if (!to || typeof to !== "string") {
        throw new Error(`Invalid recipient: ${JSON.stringify(to)}`);
    }
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        html: html,
    })

    console.log("SMTP envelope:", info.envelope);

    return info;
}