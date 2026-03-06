import { createApiClient } from "@/lib/api-interceptor";
import type {
  CreateItemPayload,
  Item,
  PaginatedItemsResponse,
  UpdateItemPayload,
} from "@/types/item";

type GetAllItemsParams = {
  accessToken?: string;
  page?: number;
  limit?: number;
};

export const getAllItems = async ({
  accessToken,
  page = 1,
  limit = 10,
}: GetAllItemsParams = {}): Promise<PaginatedItemsResponse> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.get<PaginatedItemsResponse>("/items", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

type GetActiveItemsParams = {
  accessToken?: string;
};

export const getActiveItems = async ({
  accessToken,
}: GetActiveItemsParams = {}): Promise<Item[]> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.get<Item[] | { data: Item[] }>(
    "/items/active",
  );

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.data ?? [];
};

type CreateItemParams = {
  accessToken?: string;
  payload: CreateItemPayload;
};

export const createItem = async ({
  accessToken,
  payload,
}: CreateItemParams): Promise<Item> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.post<Item>("/items", payload);

  return response.data;
};

type UpdateItemParams = {
  accessToken?: string;
  id: string;
  payload: UpdateItemPayload;
};

export const updateItem = async ({
  accessToken,
  id,
  payload,
}: UpdateItemParams): Promise<Item> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.patch<Item>(`/items/${id}`, payload);

  return response.data;
};
