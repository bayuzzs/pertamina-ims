import { createApiClient } from "@/lib/api-interceptor";
import {
  normalizeNotificationStatus,
  normalizeNotificationType,
  type Notification,
} from "@/types/notification";

type NotificationListResponse = Notification[] | { data: Notification[] };

type NotificationActionParams = {
  accessToken?: string;
};

type NotificationByIdActionParams = NotificationActionParams & {
  id: string;
};

export const getNotifications = async ({
  accessToken,
}: NotificationActionParams = {}): Promise<Notification[]> => {
  const apiClient = createApiClient(accessToken);
  const response =
    await apiClient.get<NotificationListResponse>("/notifications");

  const mapNotification = (notification: Notification): Notification => ({
    ...notification,
    type: normalizeNotificationType(notification.type),
    status: normalizeNotificationStatus(notification.status),
    path: notification.path ?? "",
  });

  if (Array.isArray(response.data)) {
    return response.data.map(mapNotification);
  }

  return (response.data.data ?? []).map(mapNotification);
};

export const markNotificationAsRead = async ({
  accessToken,
  id,
}: NotificationByIdActionParams): Promise<void> => {
  const apiClient = createApiClient(accessToken);
  await apiClient.patch(`/notifications/${id}/mark-as-read`);
};

export const deleteNotificationById = async ({
  accessToken,
  id,
}: NotificationByIdActionParams): Promise<void> => {
  const apiClient = createApiClient(accessToken);
  await apiClient.delete(`/notifications/${id}/`);
};

export const deleteAllNotifications = async ({
  accessToken,
}: NotificationActionParams): Promise<void> => {
  const apiClient = createApiClient(accessToken);
  await apiClient.delete("/notifications");
};
