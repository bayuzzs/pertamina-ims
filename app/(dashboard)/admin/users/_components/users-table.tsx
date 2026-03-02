"use client";

import type { User } from "@/types/user";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

type UsersTableProps = {
  users: User[];
};

const formatStatusLabel = (status: User["status"]) => {
  return status;
};

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table aria-label="Users table" removeWrapper className="min-w-140">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>USERNAME</TableColumn>
          <TableColumn>POSITION</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No users available" items={users}>
          {(user) => (
            <TableRow key={user.id}>
              <TableCell>
                <p className="text-foreground text-sm font-semibold">
                  {user.name}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-foreground text-sm font-semibold">
                  {user.username}
                </p>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat">
                  {user.position}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={user.status === "ACTIVE" ? "success" : "default"}
                >
                  {formatStatusLabel(user.status)}
                </Chip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
