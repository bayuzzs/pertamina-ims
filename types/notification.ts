export enum ENotificationType {
  STOCK_REQUEST = "STOCK_REQUEST",
  LOW_STOCK = "LOW_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  STOCK_MOVEMENT_REQUEST = "STOCK_MOVEMENT_REQUEST",
}

export enum ENotificationStatus {
  READ = "READ",
  UNREAD = "UNREAD",
}

export type Notification = {
  id: string;
  name: string;
  description: string;
  type: ENotificationType;
  path: string;
  status: ENotificationStatus;
  createdAt?: string;
  updatedAt?: string;
};

export const normalizeNotificationStatus = (
  value?: string,
): ENotificationStatus => {
  return String(value ?? "").toUpperCase() === ENotificationStatus.READ
    ? ENotificationStatus.READ
    : ENotificationStatus.UNREAD;
};

export const normalizeNotificationType = (
  value?: string,
): ENotificationType => {
  const normalizedValue = String(value ?? "").toUpperCase();

  if (normalizedValue === ENotificationType.LOW_STOCK) {
    return ENotificationType.LOW_STOCK;
  }

  if (normalizedValue === ENotificationType.OUT_OF_STOCK) {
    return ENotificationType.OUT_OF_STOCK;
  }

  if (normalizedValue === ENotificationType.STOCK_MOVEMENT_REQUEST) {
    return ENotificationType.STOCK_MOVEMENT_REQUEST;
  }

  return ENotificationType.STOCK_REQUEST;
};

export const isUnreadNotification = (value?: string) => {
  return normalizeNotificationStatus(value) === ENotificationStatus.UNREAD;
};
