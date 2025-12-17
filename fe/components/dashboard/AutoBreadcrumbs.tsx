"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function AutoBreadcrumbs() {
  const pathname = usePathname();
  const allSegments = pathname.split("/").filter(segment => segment !== "");

  if (allSegments.length <= 3) {
    return null;
  }

  // If path is deep (e.g. /dashboard/patient/labs/...), skip dashboard and role
  const startIndex = 2;
  const visibleSegments = allSegments.slice(startIndex);

  return (
    <Breadcrumb className="mb-4 hidden md:flex">
      <BreadcrumbList>
        {visibleSegments.map((segment, i) => {
          const originalIndex = startIndex + i;
          const isLast = i === visibleSegments.length - 1;
          const href = `/${allSegments.slice(0, originalIndex + 1).join("/")}`;
          const segmentMapping: Record<string, string> = {
            dashboard: "Dashboard",
            patient: "Patient",
            registration: "Registration",
            doctor: "Doctor",
            pharmacy: "Pharmacy",
            lab: "Lab",
            cashier: "Cashier",
            admin: "Admin",
            visits: "Visits",
            patients: "Patients",
            prescriptions: "Prescriptions",
            records: "Medical Records",
            profile: "Profile",
            settings: "Settings",
            users: "Users",
            new: "New",
            edit: "Edit",
            queue: "Queue",
            inventory: "Inventory",
            orders: "Orders",
            payments: "Payments",
            invoices: "Invoices",
            tests: "Tests",
            wearables: "Wearables",
          };

          let label = segment.replace(/-/g, " ");
          // Check if the segment (or the original segment) exists in the mapping
          if (segmentMapping[segment.toLowerCase()]) {
            label = segmentMapping[segment.toLowerCase()];
          } else {
            label = label.replace(/\b\w/g, c => c.toUpperCase());
          }

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
