"use client";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type ReportFilterProps = {
  startDate?: string;
  endDate?: string;
  status?: string;
  itemName?: string;
};

export default function ReportFilter({
  startDate = "",
  endDate = "",
  status = "approved",
  itemName = "",
}: ReportFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStatus, setLocalStatus] = useState(status);
  const [localItemName, setLocalItemName] = useState(itemName);

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Approved", value: "approved" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ];

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (localStartDate) {
      params.set("startdate", localStartDate);
    } else {
      params.delete("startdate");
      params.delete("startDate");
    }

    if (localEndDate) {
      params.set("enddate", localEndDate);
    } else {
      params.delete("enddate");
      params.delete("endDate");
    }

    if (localStatus && localStatus !== "all") {
      params.set("status", localStatus);
    } else {
      params.delete("status");
    }

    if (localItemName.trim()) {
      params.set("itemName", localItemName.trim());
    } else {
      params.delete("itemName");
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("startdate");
    params.delete("enddate");
    params.delete("startDate");
    params.delete("endDate");
    params.delete("status");
    params.delete("itemName");
    params.set("page", "1");

    setLocalStartDate("");
    setLocalEndDate("");
    setLocalStatus("approved");
    setLocalItemName("");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="border-default-100 mb-3 border-b px-2 pb-3 sm:mb-4 sm:px-3">
      <p className="text-foreground text-sm font-semibold">Report Filter</p>
      <p className="text-default-500 mt-0.5 text-xs">
        Filter stock requests by status and date range.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
        <Select
          label="Status"
          labelPlacement="outside"
          selectedKeys={localStatus ? [localStatus] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            setLocalStatus(selected ? String(selected) : "approved");
          }}
        >
          {statusOptions.map((option) => (
            <SelectItem key={option.value}>{option.label}</SelectItem>
          ))}
        </Select>
        <Input
          type="text"
          label="Item Name"
          labelPlacement="outside"
          placeholder="Search item name"
          value={localItemName}
          onValueChange={setLocalItemName}
        />
        <Input
          type="date"
          label="Start Date"
          labelPlacement="outside"
          value={localStartDate}
          onValueChange={setLocalStartDate}
        />
        <Input
          type="date"
          label="End Date"
          labelPlacement="outside"
          value={localEndDate}
          onValueChange={setLocalEndDate}
        />
        <div className="flex items-end gap-2">
          <Button color="primary" onPress={applyFilter}>
            Apply Filter
          </Button>
          <Button variant="flat" onPress={resetFilter}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
