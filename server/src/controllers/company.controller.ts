import { Request, Response } from "express";
import QRCode from "qrcode";
import { Company } from "../models/Company";
import { User } from "../models/User";

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, address, lat, lng, allowedRadius } = req.body;
    const admin = req.user as any;

    if (!name || !address || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "name, address, lat, lng are required" });
    }

    // Create company first to get the _id for the QR value
    const company = await Company.create({
      name,
      address,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      allowedRadius: allowedRadius ? parseInt(allowedRadius) : 100,
      createdBy: admin._id,
      qrValue: "TEMP",
    });

    // Generate QR value using the company ID
    const qrValue = `COMPANY_${company._id}`;
    const qrCodeBase64 = await QRCode.toDataURL(qrValue, {
      width: 300,
      margin: 2,
      color: { dark: "#0a0f1e", light: "#ffffff" },
    });

    company.qrValue = qrValue;
    company.qrCode = qrCodeBase64;
    await company.save();

    return res.status(201).json({ message: "Company created successfully", company });
  } catch (error: any) {
    console.error("createCompany error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    let companies;

    if (user.role === "admin") {
      companies = await Company.find().populate("createdBy", "firstName lastName email");
    } else {
      if (user.companyId) {
        companies = await Company.find({ _id: user.companyId });
      } else {
        companies = [];
      }
    }

    return res.json(companies);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id).populate("createdBy", "firstName lastName email");
    if (!company) return res.status(404).json({ message: "Company not found" });
    return res.json(company);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { name, address, lat, lng, allowedRadius } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (name) company.name = name;
    if (address) company.address = address;
    if (lat !== undefined || lng !== undefined) {
      const currentLat = company.location?.lat ?? 0;
      const currentLng = company.location?.lng ?? 0;
      company.location = { lat: lat !== undefined ? parseFloat(lat) : currentLat, lng: lng !== undefined ? parseFloat(lng) : currentLng };
    }
    if (allowedRadius !== undefined) company.allowedRadius = parseInt(allowedRadius);

    await company.save();
    return res.json({ message: "Company updated", company });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    return res.json({ message: "Company deleted" });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const assignInternToCompany = async (req: Request, res: Response) => {
  try {
    const { userId, companyId } = req.body;
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const user = await User.findByIdAndUpdate(userId, { companyId }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "Intern assigned to company", user });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
