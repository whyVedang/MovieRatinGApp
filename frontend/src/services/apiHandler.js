const API = import.meta.env.VITE_BACKENDAPI;

export const apiHandler = async (endpoint, options = {}) => {
  let token = localStorage.getItem("movie_mate_token");

  const header = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) header["Authorization"] = `Bearer ${token}`;

  let response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: header,
  });

  if (response.status === 401) {
    if (!token) {
      throw new Error("Unauthorized: Please log in.");
    }
    try {
      const refreshRes = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      
      if (!refreshRes.ok) throw new Error("Session expired");
      const { accesstoken } = await refreshRes.json();
      
      localStorage.setItem("movie_mate_token", accesstoken);
      window.dispatchEvent(new Event("auth-token-changed")); 

      header["Authorization"] = `Bearer ${accesstoken}`;
      response = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: header,
      });
    } catch (err) {
      localStorage.removeItem("movie_mate_token");
      window.dispatchEvent(new Event("auth-token-changed"));
      
      setTimeout(() => {
          window.location.href = "/login";
      }, 100);
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "API request failed");
  }

  return response.json();
};