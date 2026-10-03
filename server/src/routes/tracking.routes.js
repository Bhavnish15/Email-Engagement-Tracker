import express from 'express';
import {trackEmailOpen, trackLinkClick} from "../controllers/tracking.controller.js";


const router = express.Router();

router.get("/open/:token.gif", trackEmailOpen);
router.get("/click/:linkId", trackLinkClick);

router.get("/test-image.gif", (req, res) => {
  const redPixel = Buffer.from(
    "R0lGODlhAQABAIAAAP8AAP///ywAAAAAAQABAAACAUwAOw==",
    "base64"
  );

  res.set({
    "Content-Type": "image/gif",
    "Cache-Control": "no-store",
  });

  res.end(redPixel);
});

export default router;