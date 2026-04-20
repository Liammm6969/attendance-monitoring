import { useState, useEffect } from "react";
import { companyService } from "@/services/company/company.service";
import { Building2, Plus, QrCode, Trash2, Edit2, MapPin, AlertCircle, CheckCircle2, X, Download } from "lucide-react";

const CompanyModal = ({ company, onClose, onSaved }: { company?: any; onClose: () => void; onSaved: () => void }) => {
  const [form, setForm] = useState({ name: company?.name || "", address: company?.address || "", lat: company?.location?.lat || "", lng: company?.location?.lng || "", allowedRadius: company?.allowedRadius || 100 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const payload = { name: form.name, address: form.address, lat: parseFloat(String(form.lat)), lng: parseFloat(String(form.lng)), allowedRadius: parseInt(String(form.allowedRadius)) };
      if (company) await companyService.updateCompany(company._id, payload);
      else await companyService.createCompany(payload);
      onSaved(); onClose();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-white font-semibold">{company ? "Edit Company" : "Add Company"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"><AlertCircle size={15}/>{error}</div>}
          {[
            { label: "Company Name", key: "name", type: "text", placeholder: "Acme Corp" },
            { label: "Address", key: "address", type: "text", placeholder: "123 Main St, City" },
            { label: "Latitude", key: "lat", type: "number", placeholder: "14.5995" },
            { label: "Longitude", key: "lng", type: "number", placeholder: "120.9842" },
            { label: "Allowed Radius (meters)", key: "allowedRadius", type: "number", placeholder: "100" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
              <input type={type} step={type === "number" ? "any" : undefined} value={(form as any)[key]} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors" />
            </div>
          ))}
          <p className="text-xs text-slate-500">💡 Tip: Open Google Maps, right-click your workplace → copy coordinates</p>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 text-sm text-white font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all">
              {loading ? "Saving..." : company ? "Save Changes" : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CompaniesPage = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; company?: any }>({ open: false });
  const [qrModal, setQrModal] = useState<any>(null);
  const [success, setSuccess] = useState("");

  const fetchCompanies = async () => {
    try { const data = await companyService.getCompanies(); setCompanies(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this company? This cannot be undone.")) return;
    try { await companyService.deleteCompany(id); setSuccess("Company deleted."); fetchCompanies(); }
    catch {}
  };

  const downloadQR = (company: any) => {
    const link = document.createElement("a");
    link.href = company.qrCode;
    link.download = `QR_${company.name.replace(/\s+/g, "_")}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Companies</h1>
          <p className="text-slate-400 text-sm mt-1">Manage OJT partner companies and their QR codes</p>
        </div>
        <button onClick={() => setModal({ open: true })} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25">
          <Plus size={16} /> Add Company
        </button>
      </div>

      {success && <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm"><CheckCircle2 size={16}/>{success}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : companies.length === 0 ? (
        <div className="bg-[#0a1628] border border-white/5 rounded-2xl p-12 text-center">
          <Building2 size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">No companies yet</p>
          <p className="text-slate-500 text-sm mt-1">Add your first partner company to generate a QR code</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {companies.map((company) => (
            <div key={company._id} className="bg-[#0a1628] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-300 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white font-semibold truncate">{company.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5 flex items-start gap-1 leading-relaxed">
                    <MapPin size={11} className="flex-shrink-0 mt-0.5" />{company.address}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setModal({ open: true, company })} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(company._id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin size={12} className="text-indigo-400" />
                {company.location?.lat?.toFixed(5)}, {company.location?.lng?.toFixed(5)}
                <span className="ml-auto text-slate-500">{company.allowedRadius}m radius</span>
              </div>
              {company.qrCode && (
                <div className="flex flex-col items-center gap-3 bg-white rounded-xl p-4">
                  <img src={company.qrCode} alt="QR Code" className="w-32 h-32 object-contain" />
                  <p className="text-gray-500 text-xs font-mono">{company.qrValue}</p>
                  <div className="flex gap-2 w-full">
                    <button onClick={() => setQrModal(company)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors">
                      <QrCode size={13} /> View
                    </button>
                    <button onClick={() => downloadQR(company)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors">
                      <Download size={13} /> Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal.open && <CompanyModal company={modal.company} onClose={() => setModal({ open: false })} onSaved={fetchCompanies} />}

      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setQrModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="font-bold text-gray-900 text-lg mb-1">{qrModal.name}</p>
            <p className="text-gray-500 text-sm mb-4">{qrModal.address}</p>
            <img src={qrModal.qrCode} alt="QR Code" className="w-56 h-56 mx-auto object-contain" />
            <p className="text-gray-400 text-xs mt-3 font-mono">{qrModal.qrValue}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setQrModal(null)} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors">Close</button>
              <button onClick={() => downloadQR(qrModal)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
