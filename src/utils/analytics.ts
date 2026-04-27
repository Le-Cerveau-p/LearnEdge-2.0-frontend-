import { api, type AnalyticsEventPayload } from "../services/api";

const VISITOR_STORAGE_KEY = "learnedge_visitor_id";
const SESSION_STORAGE_KEY = "learnedge_session_id";

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function getStorageValue(storage: Storage | undefined, key: string, prefix: string) {
  if (!storage) {
    return createId(prefix);
  }

  const existing = storage.getItem(key);
  if (existing) {
    return existing;
  }

  const nextValue = createId(prefix);
  storage.setItem(key, nextValue);
  return nextValue;
}

export function getVisitorId() {
  if (typeof window === "undefined") {
    return createId("visitor");
  }

  return getStorageValue(window.localStorage, VISITOR_STORAGE_KEY, "visitor");
}

export function getSessionId() {
  if (typeof window === "undefined") {
    return createId("session");
  }

  return getStorageValue(window.sessionStorage, SESSION_STORAGE_KEY, "session");
}

export async function trackAnalyticsEvent(
  payload: Omit<AnalyticsEventPayload, "visitor_id" | "session_id">,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await api.trackAnalyticsEvent({
      ...payload,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      referrer: payload.referrer ?? window.document.referrer ?? null,
    });
  } catch {
    // Analytics must never block the UI flow.
  }
}
