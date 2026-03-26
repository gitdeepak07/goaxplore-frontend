import API from "./api";

export const getRequest = async (endpoint: string) => {
  try {
    const res = await fetch(`${API}/api${endpoint}`);
    if (!res.ok) throw new Error("API Error");
    return await res.json();
  } catch (err) {
    console.error("GET ERROR:", err);
    return [];
  }
};

export const postRequest = async (endpoint: string, data: any) => {
  try {
    const res = await fetch(`${API}/api${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("POST ERROR:", err);
    return null;
  }
};