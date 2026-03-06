"use client";

import {
  Avatar,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoPackageDependencies } from "react-icons/go";
import {
  MdDashboard,
  MdGroup,
  MdInventory2,
  MdKeyboardArrowDown,
  MdLocalGasStation,
} from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";

type AdminDashboardShellProps = {
  children: React.ReactNode;
  userName: string;
};

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: MdDashboard,
    href: "/admin",
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: MdInventory2,
    href: "/admin/inventory",
  },
  {
    key: "stock-requests",
    label: "Stock Request",
    icon: GoPackageDependencies,
    href: "/admin/stock-requests",
  },
  {
    key: "reports",
    label: "Reports",
    icon: TbReportAnalytics,
    href: "/admin/reports",
  },
  {
    key: "users",
    label: "User Management",
    icon: MdGroup,
    href: "/admin/users",
  },
];

export default function AdminDashboardShell({
  children,
  userName,
}: AdminDashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="bg-default-100 min-h-screen">
      <div className="flex min-h-screen">
        <aside className="bg-content1 border-default-200 hidden w-72 border-r px-4 py-4 lg:flex lg:flex-col">
          <div className="border-default-100 border-b px-2 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 rounded p-1.5">
                <MdLocalGasStation size={32} className="text-primary" />
              </div>
              <div>
                <p className="text-foreground leading-none font-bold tracking-tight">
                  Pertamina IMS
                </p>
                <p className="text-default-500 mt-1 text-xs">
                  Aviation Terminal
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 px-2">
            <p className="text-default-500 text-[11px] font-semibold tracking-wide uppercase">
              Admin Panel
            </p>
          </div>

          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-default-100"
                  }`}
                >
                  <Icon size={22} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Card className="bg-content2 border-default-200 mt-auto border shadow-none">
            <CardBody className="gap-2 p-4">
              <p className="text-foreground text-sm font-semibold">
                Admin Workspace
              </p>
              <p className="text-default-500 text-xs leading-relaxed">
                Kelola inventori, request, dan pelaporan dari satu panel
                terpusat.
              </p>
            </CardBody>
          </Card>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="bg-content1 border-default-200 flex h-16 items-center justify-between border-b px-4 sm:px-6">
            <div>
              <p className="text-foreground text-sm font-semibold">
                Admin Dashboard
              </p>
              <p className="text-default-500 text-xs">
                Operational control center
              </p>
            </div>

            <Dropdown placement="bottom-end" backdrop="blur">
              <DropdownTrigger>
                <button
                  type="button"
                  className="hover:bg-default-100 flex h-11 items-center gap-2 rounded-xl px-2 transition-colors"
                >
                  <Avatar name={userName} size="sm" className="h-7 w-7" />
                  <div className="hidden min-w-0 text-left sm:block">
                    <p className="text-foreground max-w-36 truncate text-sm font-semibold">
                      {userName}
                    </p>
                    <p className="text-default-500 text-[11px] capitalize">
                      admin
                    </p>
                  </div>
                  <MdKeyboardArrowDown size={18} className="text-default-500" />
                </button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Profile menu"
                className="min-w-44"
                onAction={(key) => {
                  if (key === "logout") {
                    signOut({ callbackUrl: "/auth" });
                  }
                }}
              >
                <DropdownItem
                  key="profile"
                  className="h-12 gap-2"
                  isReadOnly
                  textValue="Profile"
                >
                  <p className="text-foreground text-sm font-semibold">
                    {userName}
                  </p>
                  <p className="text-default-500 text-xs capitalize">admin</p>
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
