import { Request, Response } from "express";
import { DailyLog } from "../models/DailyLog";
import { User } from "../models/User";

export const submitLog = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const { tasks, date } = req.body;

    if (!tasks) return res.status(400).json({ message: "Tasks field is required" });

    const logDate = date || new Date().toISOString().split("T")[0];

    // Check for duplicate log on same day
    const existing = await DailyLog.findOne({ userId: user._id, date: logDate });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted a log for this date." });
    }

    const log = await DailyLog.create({
      userId: user._id,
      companyId: user.companyId || null,
      date: logDate,
      tasks,
      status: "pending",
    });

    return res.status(201).json({ message: "Daily log submitted successfully", log });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getMyLogs = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const logs = await DailyLog.find({ userId: user._id }).sort({ date: -1 });
    return res.json(logs);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllLogs = async (req: Request, res: Response) => {
  try {
    const { status, date } = req.query;
    let filter: any = {};
    if (status) filter.status = status;
    if (date) filter.date = date;

    const logs = await DailyLog.find(filter)
      .populate("userId", "firstName lastName email")
      .populate("companyId", "name")
      .sort({ date: -1, createdAt: -1 });

    return res.json(logs);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const reviewLog = async (req: Request, res: Response) => {
  try {
    const admin = req.user as any;
    const { adminNote } = req.body;

    const log = await DailyLog.findByIdAndUpdate(
      req.params.id,
      { status: "reviewed", adminNote: adminNote || "", reviewedBy: admin._id, reviewedAt: new Date() },
      { new: true }
    ).populate("userId", "firstName lastName email");

    if (!log) return res.status(404).json({ message: "Log not found" });
    return res.json({ message: "Log reviewed", log });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
