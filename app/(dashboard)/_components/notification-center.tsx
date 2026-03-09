"use client";

import { errorToast, successToast } from "@/lib/toast";
import { useNotificationStore } from "@/stores/notification.store";
import {
  ENotificationType,
  isUnreadNotification,
  type Notification,
} from "@/types/notification";
import {
  Button,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  MdCampaign,
  MdDeleteOutline,
  MdInventory2,
  MdLocalShipping,
  MdNotificationsNone,
  MdOutlineMarkEmailRead,
  MdWarningAmber,
} from "react-icons/md";

const getNotificationTypeConfig = (type: ENotificationType) => {
  if (type === ENotificationType.STOCK_REQUEST) {
    return {
      label: "Stock Request",
      icon: <MdCampaign size={15} className="text-primary" />,
      chipColor: "primary" as const,
    };
  }

  if (type === ENotificationType.LOW_STOCK) {
    return {
      label: "Low Stock",
      icon: <MdWarningAmber size={15} className="text-warning" />,
      chipColor: "warning" as const,
    };
  }

  if (type === ENotificationType.OUT_OF_STOCK) {
    return {
      label: "Out of Stock",
      icon: <MdInventory2 size={15} className="text-danger" />,
      chipColor: "danger" as const,
    };
  }

  return {
    label: "Stock Movement",
    icon: <MdLocalShipping size={15} className="text-secondary" />,
    chipColor: "secondary" as const,
  };
};

const formatDate = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

type NotificationCenterProps = {
  className?: string;
};

export default function NotificationCenter({
  className = "",
}: NotificationCenterProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const isMutating = useNotificationStore((state) => state.isMutating);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const deleteOne = useNotificationStore((state) => state.deleteOne);
  const deleteAll = useNotificationStore((state) => state.deleteAll);

  const accessToken = session?.accessToken;

  if (!isAdmin) {
    return null;
  }

  const handleOpenNotification = async (notification: Notification) => {
    if (!notification.path) {
      return;
    }

    if (isUnreadNotification(notification.status)) {
      await markAsRead(notification.id, accessToken);
    }

    router.push(notification.path);
  };

  const handleMarkAsRead = async (id: string) => {
    const success = await markAsRead(id, accessToken);

    if (!success) {
      errorToast("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead(accessToken);

    if (!success) {
      errorToast("Failed to mark all notifications as read");
      return;
    }

    successToast("All notifications marked as read");
  };

  const handleDeleteOne = async (id: string) => {
    const success = await deleteOne(id, accessToken);

    if (!success) {
      errorToast("Failed to delete notification");
      return;
    }

    successToast("Notification deleted");
  };

  const handleDeleteAll = async () => {
    const success = await deleteAll(accessToken);

    if (!success) {
      errorToast("Failed to delete all notifications");
      return;
    }

    successToast("All notifications deleted");
  };

  return (
    <Popover placement="bottom-end" backdrop="blur">
      <PopoverTrigger>
        <button
          type="button"
          className={`hover:bg-default-100 relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${className}`}
          aria-label="Notifications"
        >
          <MdNotificationsNone size={22} className="text-foreground" />
          {unreadCount > 0 ? (
            <span className="bg-danger text-danger-foreground absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-88 p-0 sm:w-104">
        <div className="w-full">
          <div className="border-default-200 flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-foreground text-sm font-semibold">Notifications</p>
              <p className="text-default-500 text-xs">
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="light"
                onPress={handleMarkAllAsRead}
                isDisabled={isMutating || unreadCount === 0}
              >
                Read all
              </Button>
              <Button
                size="sm"
                variant="light"
                color="danger"
                onPress={handleDeleteAll}
                isDisabled={isMutating || notifications.length === 0}
              >
                Clear all
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex h-28 items-center justify-center">
                <Spinner size="sm" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex h-28 flex-col items-center justify-center gap-1 text-center">
                <p className="text-default-600 text-sm font-medium">
                  No notifications
                </p>
                <p className="text-default-500 text-xs">
                  New updates will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => {
                  const typeConfig = getNotificationTypeConfig(notification.type);
                  const isUnread = isUnreadNotification(notification.status);

                  return (
                    <div
                      key={notification.id}
                      className={`border-default-200 rounded-xl border p-3 ${
                        isUnread ? "bg-primary/5" : "bg-content1"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenNotification(notification)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="flex items-center gap-2">
                            {typeConfig.icon}
                            <p className="text-foreground truncate text-sm font-semibold">
                              {notification.name}
                            </p>
                          </div>
                          <p className="text-default-600 mt-1 line-clamp-2 text-xs">
                            {notification.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Chip
                              size="sm"
                              variant="flat"
                              color={typeConfig.chipColor}
                            >
                              {typeConfig.label}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="flat"
                              color={isUnread ? "warning" : "default"}
                            >
                              {notification.status}
                            </Chip>
                          </div>
                          <p className="text-default-400 mt-1 text-[11px]">
                            {formatDate(notification.updatedAt ?? notification.createdAt)}
                          </p>
                        </button>

                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleMarkAsRead(notification.id)}
                            isDisabled={
                              isMutating ||
                              !isUnreadNotification(notification.status)
                            }
                            aria-label="Mark as read"
                          >
                            <MdOutlineMarkEmailRead size={16} />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => handleDeleteOne(notification.id)}
                            isDisabled={isMutating}
                            aria-label="Delete notification"
                          >
                            <MdDeleteOutline size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
