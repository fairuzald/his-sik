"use client";

import { Span } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { logoutApiAuthLogoutPost } from "@/sdk/output/sdk.gen";
import Cookies from "js-cookie";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SidebarProps {
  role: string;
  collapsible?: boolean;
}

export function Sidebar({ role, collapsible = true }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const roleFromPath = pathname.split("/")[2];
  const currentRole = role || roleFromPath || "patient";
  const items = navItems[currentRole] || [];
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = Cookies.get("refresh_token");
      if (refreshToken) {
        await logoutApiAuthLogoutPost({
          body: { refresh_token: refreshToken },
        });
      }
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed, causing local logout");
    } finally {
      // Always clear local state and redirect
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      router.push("/login"); // or /auth/login depending on route
    }
  };

  return (
    <div
      className={cn(
        "text-sidebar-foreground border-border/40 flex h-full flex-col border-r bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="border-b">
        <div
          className={cn(
            "flex h-14 items-center px-4",
            isCollapsed ? "justify-center px-2" : "justify-between"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2 overflow-hidden font-semibold"
          >
            <Image
              src="/logo.png"
              alt="MediCare Logo"
              width={40}
              height={40}
              className={cn(
                "object-contain transition-all",
                isCollapsed ? "h-8 w-8" : "h-10 w-10"
              )}
            />
            <Span
              className={cn(
                "text-primary text-xl font-bold transition-opacity",
                isCollapsed ? "w-0 opacity-0" : "opacity-100"
              )}
            >
              MediCare
            </Span>
          </Link>
          {collapsible && !isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-8 w-8 shrink-0 lg:flex"
              onClick={toggleCollapse}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        {collapsible && isCollapsed && (
          <div className="flex justify-center border-t py-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleCollapse}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground",
                  isCollapsed ? "flex justify-center px-2" : ""
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isCollapsed
                      ? "hidden h-0 w-0 opacity-0"
                      : "w-auto opacity-100"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "text-muted-foreground hover:text-destructive w-full gap-2",
            isCollapsed ? "flex justify-center px-0" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span
            className={cn(
              "overflow-hidden transition-all duration-300",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            Logout
          </span>
        </Button>
      </div>
    </div>
  );
}
