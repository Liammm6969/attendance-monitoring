import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    allowedRadius: { type: Number, default: 100 }, // meters
    qrCode: { type: String }, // base64 PNG of QR
    qrValue: { type: String, unique: true }, // e.g. COMPANY_<id>
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Company = mongoose.model("Company", CompanySchema);
