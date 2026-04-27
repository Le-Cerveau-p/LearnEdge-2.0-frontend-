import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { trackAnalyticsEvent } from "../utils/analytics";

export function usePageViewAnalytics(pageName: string) {
  const location = useLocation();
  const { user } = useAuth();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedPath.current === location.pathname) {
      return;
    }

    lastTrackedPath.current = location.pathname;
    void trackAnalyticsEvent({
      event_name: "page_view",
      user_id: user?.id ?? null,
      user_email: user?.email ?? null,
      path: location.pathname,
      metadata: {
        page: pageName,
      },
    });
  }, [location.pathname, pageName, user?.id, user?.email]);
}
