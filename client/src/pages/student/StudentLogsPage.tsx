import { useState, useEffect } from "react";
import { logsService } from "@/services/logs/logs.service";
import { format } from "date-fns";
import { BookOpen, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export const StudentLogsPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLogs = async () => {
    try { const data = await logsService.getMyLogs(); setLogs(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasks.trim()) { setError("Please describe your tasks."); return; }
    setSubmitting(true); setError(""); setSuccess("");
    try {
      await logsService.submitLog(tasks.trim());
      setSuccess("Daily log submitted successfully!");
      setTasks(""); setShowForm(false);
      fetchLogs();
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const today = new Date().toISOString().split("T")[0];
  const hasLoggedToday = logs.some((l) => l.date === today);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Logs</h1>
          <p className="text-slate-400 text-sm mt-1">Track your daily accomplishments</p>
        </div>
        {!hasLoggedToday && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            <Plus size={16} /> Log Today
          </button>
        )}
      </div>

      {error && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"><AlertCircle size={16}/>{error}</div>}
      {success && <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm"><CheckCircle2 size={16}/>{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0a1628] border border-indigo-500/30 rounded-2xl p-5 space-y-4">
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-400" /> Today's Accomplishments — {format(new Date(), "MMMM d, yyyy")}
          </h2>
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Describe what you accomplished today: tasks completed, skills learned, challenges encountered..."
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-colors"
          />
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
              {submitting ? "Submitting..." : "Submit Log"}
            </button>
          </div>
        </form>
      )}

      {hasLoggedToday && !showForm && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
          <CheckCircle2 size={16}/> You've already submitted today's log.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : logs.length === 0 ? (
        <div className="bg-[#0a1628] border border-white/5 rounded-2xl p-10 text-center">
          <BookOpen size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No logs yet. Submit your first daily log!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log._id} className="bg-[#0a1628] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-medium text-sm">{format(new Date(log.date + "T00:00:00"), "EEEE, MMMM d, yyyy")}</p>
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  log.status === "reviewed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                }`}>
                  {log.status === "reviewed" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                  {log.status}
                </span>
              </div>
              <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{log.tasks}</p>
              {log.adminNote && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-slate-500 mb-1">Supervisor feedback:</p>
                  <p className="text-slate-300 text-sm italic">{log.adminNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
