import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/prisma.js";
import emailRoutes from "./routes/email.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
    ].filter(Boolean),
  })
);
app.use(express.json());


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.status && err.status < 500
        ? err.message
        : "Internal server error",
  });
});

// Logging middleware
app.use((req, res, next) => {
  console.log(
    `[HTTP] ${req.method} ${req.originalUrl}`,
    req.get("user-agent") || ""
  );

  next();
});


// TEST API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Email Engagement Tracker API is running successfully"
    });
});

app.get("/api/db-health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({
            success: true,
            message: "Database connection is healthy"
        });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            success: false,
            message: "Database connection is not healthy"
        });
    }
});

// Email routes
app.use("/api/emails", emailRoutes);

// Tracking routes
app.use("/api/track", trackingRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});