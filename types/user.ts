export type UserStatus = "ACTIVE" | "INACTIVE";

export type User = {
  id: string;
  name: string;
  username: string;
  position: string;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserPayload = {
  name: string;
  username: string;
  password: string;
  position: string;
  status: UserStatus;
};

export type UpdateUserStatusPayload = {
  status: UserStatus;
};

export type UserPagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type PaginatedUsersResponse = {
  data: User[];
  pagination: UserPagination;
};
