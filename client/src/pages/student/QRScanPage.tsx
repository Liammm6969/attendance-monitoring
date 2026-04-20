import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { attendanceService } from "@/services/attendance/attendance.service";
import { MapPin, QrCode, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ScanState = "idle" | "scanning" | "locating" | "submitting" | "success" | "error";

export const QRScanPage = () => {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [message, setMessage] = useState("");
  const [scannedValue, setScannedValue] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState("");

  const getLocation = (): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error("Geolocation not supported")); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(new Error(`Location error: ${err.message}`)),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
  };

  const startScanner = () => {
    if (!containerRef.current || scannerRef.current) return;
    setState("scanning");
    setMessage("");
    setScannedValue("");

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        stopScanner();
        setScannedValue(decodedText);
        setState("locating");
        setMessage("Getting your location...");

        try {
          const loc = await getLocation();
          setLocation(loc);
          setState("submitting");
          setMessage("Submitting attendance...");

          const res = await attendanceService.timeIn(decodedText, loc.lat, loc.lng);
          setState("success");
          setMessage(res.message || "Time-in recorded successfully!");
        } catch (e: any) {
          setState("error");
          setMessage(e.message || "Failed to record attendance.");
        }
      },
      (err) => { /* ignore scan errors */ }
    );
    scannerRef.current = scanner;
  };

  useEffect(() => {
    // Pre-fetch location
    getLocation().then(setLocation).catch((e) => setLocationError(e.message));
    return () => stopScanner();
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Scan QR Code</h1>
        <p className="text-slate-400 text-sm mt-1">Point your camera at the company QR code to time in</p>
      </div>

      {locationError && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Location Access Required</p>
            <p className="text-xs mt-0.5 text-amber-300/80">{locationError}</p>
            <p className="text-xs mt-1 text-amber-300/80">Please enable location in your browser settings and refresh.</p>
          </div>
        </div>
      )}

      {location && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs">
          <MapPin size={14} className="flex-shrink-0" />
          <span>Location ready: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
        </div>
      )}

      {/* Scanner area */}
      <div className="bg-[#0a1628] border border-white/5 rounded-2xl overflow-hidden">
        {state === "idle" && (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <QrCode size={36} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Ready to Scan</p>
              <p className="text-slate-400 text-sm mt-1">Make sure you're at your OJT workplace</p>
            </div>
            <button
              onClick={startScanner}
              disabled={!!locationError}
              className="mt-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-95 w-full"
            >
              Start Camera
            </button>
          </div>
        )}

        {state === "scanning" && (
          <div>
            <div id="qr-reader" ref={containerRef} className="w-full" />
            <div className="p-4 text-center">
              <button onClick={() => { stopScanner(); setState("idle"); }} className="text-sm text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {(state === "locating" || state === "submitting") && (
          <div className="p-10 flex flex-col items-center gap-4 text-center">
            <Loader2 size={36} className="text-indigo-400 animate-spin" />
            <p className="text-white font-medium">{message}</p>
            {scannedValue && <p className="text-slate-500 text-xs font-mono">QR: {scannedValue}</p>}
          </div>
        )}

        {state === "success" && (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-bold text-lg">Timed In!</p>
              <p className="text-slate-300 text-sm mt-1">{message}</p>
            </div>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="mt-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all w-full"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {state === "error" && (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
              <AlertCircle size={36} className="text-red-400" />
            </div>
            <div>
              <p className="text-red-400 font-bold text-lg">Failed</p>
              <p className="text-slate-300 text-sm mt-1">{message}</p>
            </div>
            <button
              onClick={() => setState("idle")}
              className="mt-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all w-full"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-slate-500 text-xs">
        Your location is only used to verify you are within the allowed workplace radius.
      </p>
    </div>
  );
};
