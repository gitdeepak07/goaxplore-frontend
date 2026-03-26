import API from "../app/config/api";

const API_BASE = `${API}/api`;

export const CUSTOMER_SESSION_STORAGE_KEY = "goaxplore_current_user";
export const CUSTOMER_TOKEN_STORAGE_KEY = "user_token";

export interface CustomerSession {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  image_url?: string | null;
  role: "customer";
}

interface AuthResponsePayload {
  success?: boolean;
  message?: string;
  token?: string;
  data?: Partial<CustomerSession> & {
    id?: number | string;
    user_id?: number | string;
    name?: string;
    fullName?: string;
    imageUrl?: string | null;
  };
}

const normalizeCustomerSession = (
  payload: AuthResponsePayload["data"] | CustomerSession | null | undefined,
): CustomerSession => {
  const p = payload as any;
  return {
    user_id: Number(p?.user_id ?? p?.id ?? 0),
    full_name: p?.full_name ?? p?.fullName ?? p?.name ?? "GoaXplore User",
    email: p?.email ?? "",
    phone: p?.phone ?? null,
    image_url: p?.image_url ?? p?.imageUrl ?? null,
    role: "customer",
  };
};

const handleAuthResponse = async (response: Response) => {
  const payload = (await response.json().catch(() => null)) as AuthResponsePayload | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Authentication failed.");
  }

  const user = normalizeCustomerSession(payload.data);

  if (!user.user_id) {
    throw new Error("Authentication response is missing the user ID.");
  }

  return {
    token: payload.token || "",
    user,
  };
};

export const getStoredCustomerSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(CUSTOMER_SESSION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    const user = normalizeCustomerSession(parsed);

    return user.user_id ? user : null;
  } catch {
    localStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
    return null;
  }
};

export const persistCustomerSession = (
  user: CustomerSession,
  token?: string | null,
) => {
  const normalized = normalizeCustomerSession(user);

  localStorage.setItem(
    CUSTOMER_SESSION_STORAGE_KEY,
    JSON.stringify(normalized),
  );
  localStorage.setItem("user_id", String(normalized.user_id));

  if (token) {
    localStorage.setItem(CUSTOMER_TOKEN_STORAGE_KEY, token);
  }
};

export const clearCustomerSession = () => {
  localStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
  localStorage.removeItem(CUSTOMER_TOKEN_STORAGE_KEY);
  localStorage.removeItem("user_id");
};

export const loginCustomer = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return handleAuthResponse(response);
};

export const registerCustomer = async (
  fullName: string,
  email: string,
  password: string,
  phone?: string,
) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: fullName,
      email,
      password,
      phone: phone || undefined,
    }),
  });

  return handleAuthResponse(response);
};
