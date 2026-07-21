import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import projectRoutes from "./routes/projects";
import profileRoutes from "./routes/profile";
import contactRoutes from "./routes/contact";
import uploadRoutes from "./routes/upload";
import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blog";

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://fluxfolio.vercel.app",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 FluxFolio API running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received — shutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

process.on("SIGINT", async () => {
  console.log("SIGINT received — shutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
