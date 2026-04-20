import mongoose from "mongoose";

const DailyLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    date: { type: String, required: true }, // YYYY-MM-DD
    tasks: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed"],
      default: "pending",
    },
    adminNote: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true },
);

export const DailyLog = mongoose.model("DailyLog", DailyLogSchema);
