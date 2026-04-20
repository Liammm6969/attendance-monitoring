import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../models/User";

dotenv.config();

const seed = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const email = "admin@ojt.com";
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists:", email);
    await mongoose.disconnect();
    return;
  }

  const password = await bcrypt.hash("Admin@123", 10);
  await User.create({
    firstName: "System",
    lastName: "Admin",
    email,
    password,
    role: "admin",
    isVerified: true,
    totalHours: 0,
  });

  console.log("✅ Admin seeded successfully");
  console.log("   Email:    admin@ojt.com");
  console.log("   Password: Admin@123");
  console.log("   ⚠️  Change the password after first login!");

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seeder error:", err);
  process.exit(1);
});
