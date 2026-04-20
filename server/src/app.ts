import express from "express";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";
import companyRoutes from "./routes/company.routes";
import attendanceRoutes from "./routes/attendance.routes";
import dailyLogRoutes from "./routes/dailyLog.routes";

const app = express();

app.use((req, res, next) => {
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
  const origin = req.headers.origin;
  if (origin && (origin === clientUrl || origin === `${clientUrl}/`)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", clientUrl);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/logs", dailyLogRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date() }));

export default app;
