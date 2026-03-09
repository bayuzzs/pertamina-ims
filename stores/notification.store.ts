import {
  deleteAllNotifications,
  deleteNotificationById,
  getNotifications,
  markNotificationAsRead,
} from "@/services/notification.service";
import {
  ENotificationStatus,
  isUnreadNotification,
  type Notification,
} from "@/types/notification";
import { create } from "zustand";

type NotificationStore = {
  notifications: Notification[];
  isLoading: boolean;
  isMutating: boolean;
  unreadCount: number;
  fetchNotifications: (accessToken?: string) => Promise<void>;
  markAsRead: (id: string, accessToken?: string) => Promise<boolean>;
  markAllAsRead: (accessToken?: string) => Promise<boolean>;
  deleteOne: (id: string, accessToken?: string) => Promise<boolean>;
  deleteAll: (accessToken?: string) => Promise<boolean>;
  reset: () => void;
};

const sortByLatest = (notifications: Notification[]) => {
  return [...notifications].sort((first, second) => {
    const firstDate = new Date(
      first.updatedAt ?? first.createdAt ?? 0,
    ).getTime();
    const secondDate = new Date(
      second.updatedAt ?? second.createdAt ?? 0,
    ).getTime();

    return secondDate - firstDate;
  });
};

const getUnreadCount = (notifications: Notification[]) => {
  return notifications.filter((notification) =>
    isUnreadNotification(notification.status),
  ).length;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isLoading: false,
  isMutating: false,
  unreadCount: 0,

  fetchNotifications: async (accessToken) => {
    if (!accessToken) {
      set({ notifications: [], unreadCount: 0, isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      const notifications = await getNotifications({ accessToken });
      const sortedNotifications = sortByLatest(notifications);

      set({
        notifications: sortedNotifications,
        unreadCount: getUnreadCount(sortedNotifications),
      });
    } catch {
      set({ notifications: [], unreadCount: 0 });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id, accessToken) => {
    if (!accessToken) {
      return false;
    }

    set({ isMutating: true });

    try {
      await markNotificationAsRead({ accessToken, id });

      const nextNotifications = get().notifications.map((notification) => {
        if (notification.id !== id) {
          return notification;
        }

        return {
          ...notification,
          status: ENotificationStatus.READ,
        };
      });

      set({
        notifications: nextNotifications,
        unreadCount: getUnreadCount(nextNotifications),
      });

      return true;
    } catch {
      return false;
    } finally {
      set({ isMutating: false });
    }
  },

  markAllAsRead: async (accessToken) => {
    if (!accessToken) {
      return false;
    }

    const unreadNotifications = get().notifications.filter((notification) =>
      isUnreadNotification(notification.status),
    );

    if (unreadNotifications.length === 0) {
      return true;
    }

    set({ isMutating: true });

    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          markNotificationAsRead({ accessToken, id: notification.id }),
        ),
      );

      const nextNotifications = get().notifications.map((notification) => ({
        ...notification,
        status: ENotificationStatus.READ,
      }));

      set({ notifications: nextNotifications, unreadCount: 0 });

      return true;
    } catch {
      return false;
    } finally {
      set({ isMutating: false });
    }
  },

  deleteOne: async (id, accessToken) => {
    if (!accessToken) {
      return false;
    }

    set({ isMutating: true });

    try {
      await deleteNotificationById({ accessToken, id });

      const nextNotifications = get().notifications.filter(
        (notification) => notification.id !== id,
      );

      set({
        notifications: nextNotifications,
        unreadCount: getUnreadCount(nextNotifications),
      });

      return true;
    } catch {
      return false;
    } finally {
      set({ isMutating: false });
    }
  },

  deleteAll: async (accessToken) => {
    if (!accessToken) {
      return false;
    }

    set({ isMutating: true });

    try {
      await deleteAllNotifications({ accessToken });
      set({ notifications: [], unreadCount: 0 });

      return true;
    } catch {
      return false;
    } finally {
      set({ isMutating: false });
    }
  },

  reset: () => {
    set({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      isMutating: false,
    });
  },
}));
