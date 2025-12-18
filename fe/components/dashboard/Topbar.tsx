"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logoutApiAuthLogoutPost } from "@/sdk/output/sdk.gen";
import Cookies from "js-cookie";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const roleFromPath = pathname.split("/")[2];
  const currentRole = roleFromPath || "patient";

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
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      router.push("/login");
    }
  };

  return (
    <header className="border-border/40 sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-white/80 px-6 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar role={currentRole} collapsible={false} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-white/50 pl-8 md:w-[300px] lg:w-[300px]"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/patient/profile">Profile </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
