import http from "http";
import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
import { initSocket } from "./config/socket";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in environment variables");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

const server = http.createServer(app);
initSocket(server, CLIENT_URL);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 Socket.io ready`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
