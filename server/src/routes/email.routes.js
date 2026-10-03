import express from "express";
import { createEmail, getEmails, getEmailAnalytics } from "../controllers/email.controller.js";
import { createEmailSchema } from "../schemas/email.schema.js";
import { validate } from "../middleware/validate.js";


const router = express.Router();

router.post("/create-emails", validate(createEmailSchema), createEmail);
router.get("/", getEmails);
router.get("/:id/analytics", getEmailAnalytics);


export default router;