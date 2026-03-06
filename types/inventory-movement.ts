export type CreateInventoryMovementPayload = {
  itemId: string;
  remark?: string;
  area: string;
  equipment: string;
  date: string;
  quantity: string;
  technicianNote: string;
};

export type ConfirmInventoryMovementPayload = {
  status: Extract<InventoryMovementStatus, "approved" | "rejected">;
  adminNote?: string;
};

export type InventoryMovementType = "in" | "out";
export type InventoryMovementStatus = "pending" | "approved" | "rejected";

export type InventoryMovementItem = {
  id: string;
  itemNo: string;
  name: string;
  stock: number;
  unit: string;
};

export type InventoryMovementTechnician = {
  id: string;
  name: string;
  position: string;
  username: string;
  status: string;
};

export type InventoryMovement = {
  createdAt?: string;
  updatedAt?: string;
  id: string;
  itemId?: string;
  remark?: string;
  area: string;
  equipment: string;
  date: string;
  quantity: string;
  technicianNote: string;
  adminNote?: string | null;
  type?: InventoryMovementType | string;
  status?: InventoryMovementStatus | string;
  item?: InventoryMovementItem;
  technician?: InventoryMovementTechnician;
};

export type InventoryMovementPagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type PaginatedInventoryMovementsResponse = {
  data: InventoryMovement[];
  pagination: InventoryMovementPagination;
};
