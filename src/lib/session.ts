/* eslint-disable prettier/prettier */
// Simple client-side session for demo flow gating (no backend).
const AUTH_KEY = "priceai_auth";
const ONBOARD_KEY = "priceai_onboarded";

export type SessionUser = {
  user_id: string;
  name: string;
  email: string;
  token: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getUser(): SessionUser | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function setUser(u: SessionUser) {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  window.dispatchEvent(new Event("priceai:session"));
}

export function clearSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(ONBOARD_KEY);
  window.dispatchEvent(new Event("priceai:session"));
}

export function isOnboarded(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(ONBOARD_KEY) === "1";
}

export function setOnboarded(v: boolean) {
  if (!isBrowser()) return;
  if (v) localStorage.setItem(ONBOARD_KEY, "1");
  else localStorage.removeItem(ONBOARD_KEY);
  window.dispatchEvent(new Event("priceai:session"));
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
