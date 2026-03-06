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
import { MdCheckCircle, MdError, MdWarningAmber } from "react-icons/md";
import EditItemModal from "./edit-item-modal";

type InventoryTableProps = {
  items: Item[];
  accessToken?: string;
};

const STOCK_THIN_THRESHOLD = 30;

const getStockBadgeConfig = (stock: number) => {
  if (stock <= 0) {
    return {
      color: "danger" as const,
      icon: <MdError size={16} />,
    };
  }

  if (stock <= STOCK_THIN_THRESHOLD) {
    return {
      color: "warning" as const,
      icon: <MdWarningAmber size={16} />,
    };
  }

  return {
    color: "success" as const,
    icon: <MdCheckCircle size={16} />,
  };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function InventoryTable({
  items,
  accessToken,
}: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table aria-label="Inventory table" removeWrapper className="min-w-250">
        <TableHeader>
          <TableColumn>ITEM NO</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>VENDOR</TableColumn>
          <TableColumn>LOCATION</TableColumn>
          <TableColumn className="text-right">COST</TableColumn>
          <TableColumn className="text-center">STOCK</TableColumn>
          <TableColumn className="text-center">UNIT</TableColumn>
          <TableColumn className="text-center">STATUS</TableColumn>
          <TableColumn className="text-center">ACTION</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No inventory items available" items={items}>
          {(item) => {
            const stockBadgeConfig = getStockBadgeConfig(item.stock);

            return (
              <TableRow key={item.id} className="hover:bg-gray-100">
                <TableCell className="rounded-l-lg">
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
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={stockBadgeConfig.color}
                    startContent={stockBadgeConfig.icon}
                    classNames={{
                      base: "min-w-14! w-full gap-0.5",
                    }}
                  >
                    {item.stock}
                  </Chip>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-default-700 text-sm font-medium uppercase">
                    {item.unit}
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
                <TableCell className="rounded-r-lg text-center">
                  <EditItemModal item={item} accessToken={accessToken} />
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
}
