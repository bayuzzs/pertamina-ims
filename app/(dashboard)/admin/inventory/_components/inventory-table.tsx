"use client";

import type { Item } from "@/types/item";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

type InventoryTableProps = {
  items: Item[];
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function InventoryTable({ items }: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table aria-label="Inventory table" removeWrapper className="min-w-230">
        <TableHeader>
          <TableColumn>ITEM NO</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>VENDOR</TableColumn>
          <TableColumn>LOCATION</TableColumn>
          <TableColumn className="text-right">COST</TableColumn>
          <TableColumn className="text-center">STOCK</TableColumn>
          <TableColumn className="text-center">STATUS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No inventory items available" items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                <span className="text-foreground/90 text-xs font-semibold tracking-wide">
                  {item.itemNo}
                </span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {item.name}
                  </p>
                  <p className="text-default-500 line-clamp-2 text-xs">
                    {item.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-foreground text-sm">{item.vendor}</p>
              </TableCell>
              <TableCell>
                <p className="text-default-600 text-sm">{item.location}</p>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-foreground text-sm font-semibold">
                  {formatCurrency(item.cost)}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-foreground text-sm font-medium">
                  {item.stock} {item.unit}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Chip
                  size="sm"
                  variant="flat"
                  color={item.status === "active" ? "success" : "default"}
                  className="capitalize"
                >
                  {item.status}
                </Chip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
