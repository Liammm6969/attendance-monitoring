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

export const attendanceService = {
  timeIn: (qrValue: string, lat: number, lng: number) =>
    fetch(`${API}/attendance/time-in`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ qrValue, lat, lng }),
    }).then(handleResponse),

  timeOut: () =>
    fetch(`${API}/attendance/time-out`, {
      method: "POST",
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getTodayAttendance: () =>
    fetch(`${API}/attendance/today`, { headers: getAuthHeaders() }).then(handleResponse),

  getMyAttendance: (month?: number, year?: number) => {
    const params = month && year ? `?month=${month}&year=${year}` : "";
    return fetch(`${API}/attendance/me${params}`, { headers: getAuthHeaders() }).then(handleResponse);
  },

  getAllInterns: () =>
    fetch(`${API}/attendance/interns`, { headers: getAuthHeaders() }).then(handleResponse),

  getAttendanceSummary: (userId: string) =>
    fetch(`${API}/attendance/summary/${userId}`, { headers: getAuthHeaders() }).then(handleResponse),
};
