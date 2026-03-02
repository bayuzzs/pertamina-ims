import { createApiClient } from "@/lib/api-interceptor";
import type { CreateUserPayload, User } from "@/types/user";

type GetAllUsersParams = {
  accessToken?: string;
};

export const getAllUsers = async ({
  accessToken,
}: GetAllUsersParams = {}): Promise<User[]> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.get<User[] | { data: User[] }>(
    "/technicians",
  );

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.data ?? [];
};

type CreateUserParams = {
  accessToken?: string;
  payload: CreateUserPayload;
};

export const createUser = async ({
  accessToken,
  payload,
}: CreateUserParams): Promise<User> => {
  const apiClient = createApiClient(accessToken);
  const response = await apiClient.post<User>("/technicians", payload);

  return response.data;
};
