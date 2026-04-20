import { useState, useEffect } from "react";
import { logsService } from "@/services/logs/logs.service";
import { format } from "date-fns";
import { ClipboardList, CheckCircle2, Clock, Filter, X, ChevronDown } from "lucide-react";

export const AdminLogsPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [reviewModal, setReviewModal] = useState<any>(null);
  const [adminNote, setAdminNote] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try { const data = await logsService.getAllLogs(statusFilter ? { status: statusFilter } : {}); setLogs(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, [statusFilter]);

  const handleReview = async () => {
    if (!reviewModal) return;
    setReviewing(true);
    try {
      await logsService.reviewLog(reviewModal._id, adminNote);
      setSuccess("Log marked as reviewed!");
      setReviewModal(null); setAdminNote("");
      fetchLogs();
    } catch {} finally { setReviewing(false); }
  };

  const pending = logs.filter((l) => l.status === "pending").length;
  const reviewed = logs.filter((l) => l.status === "reviewed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Logs</h1>
          <p className="text-slate-400 text-sm mt-1">Review intern daily accomplishment logs</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-xl font-medium">{pending} Pending</span>
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl font-medium">{reviewed} Reviewed</span>
        </div>
      </div>

      {success && <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm"><CheckCircle2 size={16}/>{success}</div>}

      {/* Filter */}
      <div className="flex gap-2">
        {[{ val: "", label: "All" }, { val: "pending", label: "Pending" }, { val: "reviewed", label: "Reviewed" }].map(({ val, label }) => (
          <button key={val} onClick={() => setStatusFilter(val)} className={`px-3 py-2 text-xs font-medium rounded-xl transition-all ${statusFilter === val ? "bg-indigo-600 text-white" : "bg-[#0a1628] text-slate-400 border border-white/5 hover:text-white"}`}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : logs.length === 0 ? (
        <div className="bg-[#0a1628] border border-white/5 rounded-2xl py-12 text-center"><ClipboardList size={28} className="text-slate-600 mx-auto mb-2" /><p className="text-slate-500 text-sm">No logs found</p></div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log._id} className="bg-[#0a1628] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {log.userId?.firstName?.[0]}{log.userId?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{log.userId?.firstName} {log.userId?.lastName}</p>
                    <p className="text-slate-500 text-xs">{log.userId?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-slate-400 text-xs">{format(new Date(log.date + "T00:00:00"), "MMM d, yyyy")}</span>
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${log.status === "reviewed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {log.status === "reviewed" ? <CheckCircle2 size={11} /> : <Clock size={11} />}{log.status}
                  </span>
                </div>
              </div>
              <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{log.tasks}</p>
              {log.adminNote && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-slate-500 text-xs mb-1">Your feedback:</p>
                  <p className="text-slate-300 text-sm italic">{log.adminNote}</p>
                </div>
              )}
              {log.status === "pending" && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <button onClick={() => { setReviewModal(log); setAdminNote(""); }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-500 px-4 py-1.5 rounded-lg transition-all">
                    Mark as Reviewed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0a1628] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Review Log</h2>
              <button onClick={() => setReviewModal(null)} className="text-slate-400 hover:text-white"><X size={18}/></button>
            </div>
            <p className="text-slate-400 text-sm">{reviewModal.userId?.firstName} {reviewModal.userId?.lastName} — {format(new Date(reviewModal.date + "T00:00:00"), "MMMM d, yyyy")}</p>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Feedback (optional)</label>
            <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Add feedback or notes for the intern..." rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-colors" />
            <div className="flex gap-3">
              <button onClick={() => setReviewModal(null)} className="flex-1 py-2.5 text-sm text-slate-400 bg-white/5 hover:bg-white/10 rounded-xl transition-all">Cancel</button>
              <button onClick={handleReview} disabled={reviewing} className="flex-1 py-2.5 text-sm text-white font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl transition-all">
                {reviewing ? "Saving..." : "Confirm Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
