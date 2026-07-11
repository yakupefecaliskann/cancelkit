import type { ConfigResponse, CreateSessionResponse } from "./types";

function buildUrl(path: string, key: string): string {
  const target = new URL(path, __CANCELKIT_API_BASE__ || window.location.origin);
  target.searchParams.set("key", key);
  return target.toString();
}

export async function fetchConfig(key: string): Promise<ConfigResponse> {
  const response = await fetch(buildUrl("/api/v1/config", key));
  if (!response.ok) throw new Error("cancelkit_config_failed");
  return response.json();
}

export async function createSession(
  key: string,
  body: {
    reasonId?: string;
    reasonText?: string;
    customerId?: string;
    customerEmail?: string;
  },
): Promise<CreateSessionResponse> {
  const response = await fetch(buildUrl("/api/v1/sessions", key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("cancelkit_session_failed");
  return response.json();
}

export async function acceptSession(
  key: string,
  sessionId: string,
  sessionToken: string,
): Promise<void> {
  const response = await fetch(buildUrl(`/api/v1/sessions/${sessionId}/accept`, key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken }),
  });
  if (!response.ok) throw new Error("cancelkit_accept_failed");
}

export async function closeSession(
  key: string,
  sessionId: string,
  sessionToken: string,
  outcome: "churned" | "abandoned",
): Promise<void> {
  const response = await fetch(buildUrl(`/api/v1/sessions/${sessionId}/close`, key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken, outcome }),
  });
  if (!response.ok) throw new Error("cancelkit_close_failed");
}
