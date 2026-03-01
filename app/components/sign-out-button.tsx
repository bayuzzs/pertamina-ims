"use client";

import { Button } from "@heroui/react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <Button
      color="danger"
      variant="flat"
      onPress={() => signOut({ callbackUrl: "/auth" })}
    >
      Sign Out
    </Button>
  );
}
