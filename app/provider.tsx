"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import NotificationProvider from "./notification-provider";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <HeroUIProvider>
        <ToastProvider placement="top-right" toastOffset={10} />
        <NotificationProvider />
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
}
