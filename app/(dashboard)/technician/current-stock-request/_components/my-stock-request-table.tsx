"use client";

import type { InventoryMovement } from "@/types/inventory-movement";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { useMemo, useState } from "react";

type MyStockRequestTableProps = {
  requests: InventoryMovement[];
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

export default function MyStockRequestTable({
  requests,
}: MyStockRequestTableProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedRequestId),
    [requests, selectedRequestId],
  );

  const handleOpenDetail = (id: string) => {
    setSelectedRequestId(id);
    onOpen();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table
          aria-label="My stock request table"
          removeWrapper
          className="min-w-220"
        >
          <TableHeader>
            <TableColumn>DATE</TableColumn>
            <TableColumn>ITEM</TableColumn>
            <TableColumn>QTY</TableColumn>
            <TableColumn>AREA</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn className="text-center">ACTION</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No stock requests found" items={requests}>
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
                  <p className="text-default-600 text-sm">{request.area}</p>
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
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => handleOpenDetail(request.id)}
                  >
                    See Details
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <p className="text-foreground text-base font-semibold">
              Stock Request Details
            </p>
            <p className="text-default-500 text-xs font-normal">
              Detailed request information.
            </p>
          </ModalHeader>

          <ModalBody className="pb-5">
            {selectedRequest ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-default-500 text-xs">Date</p>
                  <p className="text-foreground text-sm font-medium">
                    {formatDate(selectedRequest.date)}
                  </p>
                </div>
                <div>
                  <p className="text-default-500 text-xs">Status</p>
                  <p className="text-foreground text-sm font-medium capitalize">
                    {selectedRequest.status ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-default-500 text-xs">Item</p>
                  <p className="text-foreground text-sm font-medium">
                    {selectedRequest.item?.name ?? "-"}
                  </p>
                  <p className="text-default-500 text-xs">
                    {selectedRequest.item?.itemNo ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-default-500 text-xs">Quantity</p>
                  <p className="text-foreground text-sm font-medium">
                    {selectedRequest.quantity}{" "}
                    {selectedRequest.item?.unit ?? ""}
                  </p>
                </div>
                <div>
                  <p className="text-default-500 text-xs">Area</p>
                  <p className="text-foreground text-sm font-medium">
                    {selectedRequest.area}
                  </p>
                </div>
                <div>
                  <p className="text-default-500 text-xs">Equipment</p>
                  <p className="text-foreground text-sm font-medium">
                    {selectedRequest.equipment}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-default-500 text-xs">Technician Note</p>
                  <p className="text-foreground text-sm leading-relaxed">
                    {selectedRequest.technicianNote || "-"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-default-500 text-xs">Remark</p>
                  <p className="text-foreground text-sm leading-relaxed">
                    {selectedRequest.remark || "-"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-default-500 text-xs">Admin Note</p>
                  <p className="text-foreground text-sm leading-relaxed">
                    {selectedRequest.adminNote || "-"}
                  </p>
                </div>
              </div>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
