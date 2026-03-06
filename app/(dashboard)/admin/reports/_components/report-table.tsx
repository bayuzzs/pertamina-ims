"use client";

import type { InventoryMovement } from "@/types/inventory-movement";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

type ReportTableProps = {
  requests: InventoryMovement[];
};

const getStatusColor = (status?: string) => {
  if (status === "approved") {
    return "success" as const;
  }

  if (status === "rejected") {
    return "danger" as const;
  }

  if (status === "pending") {
    return "warning" as const;
  }

  return "default" as const;
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function ReportTable({ requests }: ReportTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table
        aria-label="Approved stock request report table"
        removeWrapper
        className="min-w-220"
      >
        <TableHeader>
          <TableColumn>DATE</TableColumn>
          <TableColumn>TECHNICIAN</TableColumn>
          <TableColumn>ITEM</TableColumn>
          <TableColumn>QTY</TableColumn>
          <TableColumn>AREA</TableColumn>
          <TableColumn>EQUIPMENT</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No approved requests found" items={requests}>
          {(request) => (
            <TableRow key={request.id}>
              <TableCell>
                <p className="text-foreground text-sm">
                  {formatDate(request.date)}
                </p>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {request.technician?.name ?? "-"}
                  </p>
                  <p className="text-default-500 text-xs">
                    {request.technician?.position ?? "-"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {request.item?.name ?? "-"}
                  </p>
                  <p className="text-default-500 text-xs">
                    {request.item?.itemNo ?? "-"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-foreground text-sm font-medium">
                  {request.quantity} {request.item?.unit ?? ""}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-foreground text-sm">{request.area || "-"}</p>
              </TableCell>
              <TableCell>
                <p className="text-foreground text-sm">
                  {request.equipment || "-"}
                </p>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={getStatusColor(request.status)}
                  className="capitalize"
                >
                  {request.status ?? "-"}
                </Chip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
