const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data;
};

export const companyService = {
  getCompanies: () =>
    fetch(`${API}/companies`, { headers: getAuthHeaders() }).then(handleResponse),

  getCompany: (id: string) =>
    fetch(`${API}/companies/${id}`, { headers: getAuthHeaders() }).then(handleResponse),

  createCompany: (data: { name: string; address: string; lat: number; lng: number; allowedRadius?: number }) =>
    fetch(`${API}/companies`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateCompany: (id: string, data: Partial<{ name: string; address: string; lat: number; lng: number; allowedRadius: number }>) =>
    fetch(`${API}/companies/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteCompany: (id: string) =>
    fetch(`${API}/companies/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(handleResponse),

  assignIntern: (userId: string, companyId: string) =>
    fetch(`${API}/companies/assign-intern`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, companyId }),
    }).then(handleResponse),
};
