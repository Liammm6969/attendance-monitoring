import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    totalHours: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    if (this.password && this.password.startsWith("$2")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model("User", UserSchema);