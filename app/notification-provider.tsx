"use client";

import { useNotificationStore } from "@/stores/notification.store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const REFRESH_INTERVAL_MS = 60_000;

export default function NotificationProvider() {
  const { data: session, status } = useSession();
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications,
  );
  const resetNotifications = useNotificationStore((state) => state.reset);

  useEffect(() => {
    const isAdmin = session?.user?.role === "admin";

    if (status !== "authenticated" || !session?.accessToken || !isAdmin) {
      resetNotifications();
      return;
    }

    const accessToken = session.accessToken;

    const fetchNow = () => {
      void fetchNotifications(accessToken);
    };

    fetchNow();

    const intervalId = window.setInterval(fetchNow, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    fetchNotifications,
    resetNotifications,
    session?.accessToken,
    session?.user?.role,
    status,
  ]);

  return null;
}
