import { createApiClient } from "@/lib/api-interceptor";
import type {
  CreateItemPayload,
  Item,
  PaginatedItemsResponse,
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
