const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { headers, ...rest });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      auth: false,
    }),
  signup: (data: { name: string; email: string; password: string; companyName?: string }) =>
    request<{ msg: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        companyName: data.companyName || data.name, // Use name as company if not provided
      }),
      auth: false,
    }),
};

// Backends
export const backendsApi = {
  list: () => request<any[]>("/api/backends/list"),
  create: (data: { name: string; url: string }) =>
    request<any>("/api/backends/add", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/api/backends/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<any>(`/api/backends/${id}`, { method: "DELETE" }),
  health: (id: string) =>
    request<any>(`/api/backends/${id}/health`),
};

// Metrics (fetched via REST, real-time via Socket.IO separately)
export const metricsApi = {
  overview: () => request<any>("/api/metrics/overview"),
  backend: (id: string) => request<any>(`/api/metrics/${id}`),
};
