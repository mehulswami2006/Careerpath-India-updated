const BASE_URL = "http://localhost:8080";

export async function api(endpoint, method = "GET", body = null) {

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}
