export type ItemStatus = "active" | "discontinued";
export type ItemUnit = "pcs" | "liter";

export type Item = {
  createdAt: string;
  updatedAt: string;
  id: string;
  itemNo: string;
  name: string;
  description: string;
  vendor: string;
  location: string;
  cost: number;
  stock: number;
  unit: ItemUnit;
  status: ItemStatus;
};

export type CreateItemPayload = {
  itemNo: string;
  name: string;
  description: string;
  vendor: string;
  location: string;
  cost: number;
  stock: number;
  unit: ItemUnit;
  status: ItemStatus;
};

export type UpdateItemPayload = {
  name: string;
  description: string;
  vendor: string;
  location: string;
  cost: number;
  stock: number;
  unit: ItemUnit;
  status: ItemStatus;
};

export type ItemPagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type PaginatedItemsResponse = {
  data: Item[];
  pagination: ItemPagination;
};
