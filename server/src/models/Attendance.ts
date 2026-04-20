import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    timeIn: { type: Date },
    timeOut: { type: Date },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    hoursWorked: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },
    isActive: { type: Boolean, default: true }, // true until timeOut
  },
  { timestamps: true },
);

export const Attendance = mongoose.model("Attendance", AttendanceSchema);
