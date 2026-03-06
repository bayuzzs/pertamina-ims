import { createApiClient } from "@/lib/api-interceptor";
import type {
  ConfirmInventoryMovementPayload,
  CreateInventoryMovementPayload,
  InventoryMovement,
  PaginatedInventoryMovementsResponse,
} from "@/types/inventory-movement";

type GetInventoryMovementsParams = {
  accessToken?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  itemName?: string;
};

export const getInventoryMovements = async ({
  accessToken,
  page = 1,
  limit = 10,
  startDate,
  endDate,
  status,
  itemName,
}: GetInventoryMovementsParams = {}): Promise<PaginatedInventoryMovementsResponse> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.get<
    PaginatedInventoryMovementsResponse | InventoryMovement[]
  >("/inventory-movements", {
    params: {
      page,
      limit,
      ...(startDate ? { startdate: startDate, startDate } : {}),
      ...(endDate ? { enddate: endDate, endDate } : {}),
      ...(status ? { status } : {}),
      ...(itemName ? { itemName } : {}),
    },
  });

  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      pagination: {
        total: response.data.length,
        page: 1,
        limit,
        pages: 1,
      },
    };
  }

  return response.data;
};

type GetApprovedInventoryMovementsParams = {
  accessToken?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export const getApprovedInventoryMovements = async ({
  accessToken,
  page = 1,
  limit = 10,
  startDate,
  endDate,
}: GetApprovedInventoryMovementsParams = {}): Promise<PaginatedInventoryMovementsResponse> => {
  return getInventoryMovements({
    accessToken,
    page,
    limit,
    startDate,
    endDate,
    status: "approved",
  });
};

export const getPendingInventoryMovements = async ({
  accessToken,
  page = 1,
  limit = 10,
}: GetInventoryMovementsParams = {}): Promise<PaginatedInventoryMovementsResponse> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.get<
    PaginatedInventoryMovementsResponse | InventoryMovement[]
  >("/inventory-movements/pending", {
    params: {
      page,
      limit,
    },
  });

  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      pagination: {
        total: response.data.length,
        page: 1,
        limit,
        pages: 1,
      },
    };
  }

  return response.data;
};

type GetMyInventoryMovementsParams = {
  accessToken?: string;
  page?: number;
  limit?: number;
};

export const getMyInventoryMovements = async ({
  accessToken,
  page = 1,
  limit = 10,
}: GetMyInventoryMovementsParams = {}): Promise<PaginatedInventoryMovementsResponse> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.get<
    PaginatedInventoryMovementsResponse | InventoryMovement[]
  >("/inventory-movements/my", {
    params: {
      page,
      limit,
    },
  });

  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      pagination: {
        total: response.data.length,
        page: 1,
        limit,
        pages: 1,
      },
    };
  }

  return response.data;
};

type CreateInventoryMovementParams = {
  accessToken?: string;
  payload: CreateInventoryMovementPayload;
};

export const createInventoryMovement = async ({
  accessToken,
  payload,
}: CreateInventoryMovementParams): Promise<InventoryMovement> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.post<InventoryMovement>(
    "/inventory-movements",
    payload,
  );

  return response.data;
};

type ConfirmInventoryMovementParams = {
  accessToken?: string;
  id: string;
  payload: ConfirmInventoryMovementPayload;
};

export const confirmInventoryMovement = async ({
  accessToken,
  id,
  payload,
}: ConfirmInventoryMovementParams): Promise<InventoryMovement> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.patch<InventoryMovement>(
    `/inventory-movements/${id}/confirm`,
    payload,
  );

  return response.data;
};
