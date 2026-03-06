"use client";

import { errorToast, successToast } from "@/lib/toast";
import { confirmInventoryMovement } from "@/services/inventory-movement.service";
import type {
  InventoryMovement,
  InventoryMovementStatus,
} from "@/types/inventory-movement";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type StockRequestTableProps = {
  requests: InventoryMovement[];
  accessToken?: string;
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

export default function StockRequestTable({
  requests,
  accessToken,
}: StockRequestTableProps) {
  const router = useRouter();
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onOpenChange: onDetailOpenChange,
  } = useDisclosure();
  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onOpenChange: onApproveOpenChange,
  } = useDisclosure();

  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [adminNote, setAdminNote] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [confirmStatus, setConfirmStatus] =
    useState<Extract<InventoryMovementStatus, "approved" | "rejected">>(
      "approved",
    );

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedRequestId),
    [requests, selectedRequestId],
  );

  const handleOpenDetail = (id: string) => {
    setSelectedRequestId(id);
    onDetailOpen();
  };

  const handleOpenApprove = (id: string) => {
    setSelectedRequestId(id);
    setAdminNote("");
    setConfirmStatus("approved");
    onApproveOpen();
  };

  const handleApprove = async () => {
    if (!selectedRequestId) {
      return;
    }

    try {
      setIsApproving(true);

      await confirmInventoryMovement({
        accessToken,
        id: selectedRequestId,
        payload: {
          status: confirmStatus,
          adminNote: adminNote.trim() || undefined,
        },
      });

      successToast(
        confirmStatus === "approved"
          ? "Stock request approved successfully"
          : "Stock request rejected successfully",
      );
      onApproveOpenChange();
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        errorToast(
          error.response?.data?.message ||
            "Failed to confirm request. Please try again.",
        );
        return;
      }

      errorToast("Failed to confirm request. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table
          aria-label="Admin stock request table"
          removeWrapper
          className="min-w-220"
        >
          <TableHeader>
            <TableColumn>DATE</TableColumn>
            <TableColumn>TECHNICIAN</TableColumn>
            <TableColumn>ITEM</TableColumn>
            <TableColumn>QTY</TableColumn>
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
                  <Chip
                    size="sm"
                    variant="flat"
                    color={getStatusColor(request.status)}
                    className="capitalize"
                  >
                    {request.status ?? "-"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => handleOpenDetail(request.id)}
                    >
                      See Details
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => handleOpenApprove(request.id)}
                      isDisabled={request.status !== "pending"}
                    >
                      Approve
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isDetailOpen}
        onOpenChange={onDetailOpenChange}
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
                  <p className="text-default-500 text-xs">Technician</p>
                  <p className="text-foreground text-sm font-medium">
                    {selectedRequest.technician?.name ?? "-"}
                  </p>
                  <p className="text-default-500 text-xs">
                    {selectedRequest.technician?.position ?? "-"}
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

      <Modal
        isOpen={isApproveOpen}
        onOpenChange={onApproveOpenChange}
        size="lg"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p className="text-foreground text-base font-semibold">
                  Confirm Stock Request
                </p>
                <p className="text-default-500 text-xs font-normal">
                  Choose approve or reject for selected request.
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={confirmStatus === "approved" ? "solid" : "flat"}
                    color="success"
                    onPress={() => setConfirmStatus("approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant={confirmStatus === "rejected" ? "solid" : "flat"}
                    color="danger"
                    onPress={() => setConfirmStatus("rejected")}
                  >
                    Reject
                  </Button>
                </div>
                <Textarea
                  label="Admin Note"
                  labelPlacement="outside"
                  placeholder="Optional note for technician"
                  value={adminNote}
                  onValueChange={setAdminNote}
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={isApproving}
                >
                  Cancel
                </Button>
                <Button
                  color={confirmStatus === "approved" ? "success" : "danger"}
                  onPress={handleApprove}
                  isLoading={isApproving}
                >
                  {confirmStatus === "approved"
                    ? "Approve Request"
                    : "Reject Request"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
