"use client";

import { errorToast, successToast } from "@/lib/toast";
import { updateUserStatus } from "@/services/user.service";
import type { User } from "@/types/user";
import {
  Chip,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

type UsersTableProps = {
  users: User[];
  accessToken?: string;
};

export default function UsersTable({ users, accessToken }: UsersTableProps) {
  const [rows, setRows] = useState<User[]>(users);
  const pendingIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setRows(users);
  }, [users]);

  const handleSwitchChange = async (userId: string) => {
    if (pendingIdsRef.current.has(userId)) {
      return;
    }

    const currentUser = rows.find((item) => item.id === userId);

    if (!currentUser) {
      return;
    }

    const nextStatus: User["status"] =
      currentUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const previousStatus = currentUser.status;
    pendingIdsRef.current.add(userId);

    setRows((previous) =>
      previous.map((item) =>
        item.id === userId ? { ...item, status: nextStatus } : item,
      ),
    );

    try {
      await updateUserStatus({
        accessToken,
        id: userId,
        payload: {
          status: nextStatus,
        },
      });

      successToast("User status updated successfully");
    } catch (error) {
      setRows((previous) =>
        previous.map((item) =>
          item.id === userId ? { ...item, status: previousStatus } : item,
        ),
      );

      if (error instanceof AxiosError) {
        errorToast(
          error.response?.data?.message ||
            "Failed to update user status. Please try again.",
        );
      } else {
        errorToast("Failed to update user status. Please try again.");
      }
    } finally {
      pendingIdsRef.current.delete(userId);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table aria-label="Users table" removeWrapper className="min-w-140">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>USERNAME</TableColumn>
          <TableColumn>POSITION</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No users available" items={rows}>
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
                <Switch
                  isSelected={user.status === "ACTIVE"}
                  onValueChange={() => void handleSwitchChange(user.id)}
                  size="sm"
                  color="success"
                >
                  {user.status === "ACTIVE" ? "Active" : "Inactive"}
                </Switch>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
