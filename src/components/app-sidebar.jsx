"use client";

import * as React from "react";
import Cookies from "js-cookie";
import {
  IconAlertCircle,
  IconBuildingSkyscraper,
  IconCoin,
  IconCreditCard,
  IconDashboard,
  IconFileReport,
  IconReceipt,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconBrandBooking,
  IconReportMoney,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      roles: ["admin", "super_admin", "member", "out_member"],
    },
    {
      title: "Kamar",
      url: "/dashboard/kamar",
      icon: IconBuildingSkyscraper,
      roles: ["admin", "super_admin"],
    },
    {
      title: "Pengguna",
      url: "/dashboard/pengguna",
      icon: IconUsers,
      roles: ["admin", "super_admin"],
    },
    {
      title: "Laporan Pengaduan",
      url: "/dashboard/laporan-pengaduan",
      icon: IconAlertCircle,
      roles: ["admin", "super_admin"],
    },
    {
      title: "Laporan Keuangan",
      url: "/dashboard/laporan-keuangan",
      icon: IconCoin,
      roles: ["admin", "super_admin"],
    },
    {
      title: "Data Pengajuan Booking",
      url: "/dashboard/laporan-booking",
      icon: IconBrandBooking,
      roles: ["admin", "super_admin"],
    },
    {
      title: "Pembayaran",
      url: "/dashboard/pembayaran",
      icon: IconCreditCard,
      roles: ["super_admin", "member", "out_member"],
    },
    {
      title: "Pengaduan",
      url: "/dashboard/pengajuan-pengaduan",
      icon: IconFileReport,
      roles: ["super_admin", "member"],
    },
    {
      title: "Riwayat Transaksi Pembayaran",
      url: "/dashboard/riwayat-transaksi",
      icon: IconReportMoney,
      roles: ["super_admin", "member", "out_member"],
    },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
};

export function AppSidebar(props) {
  const { user } = useAuth();
  const [filteredNavMain, setFilteredNavMain] = React.useState([]);

  React.useEffect(() => {
    if (!user) {
      setFilteredNavMain([]);
      return;
    }

    const userRoles = Array.isArray(user.roles)
      ? user.roles.map((r) => r.toLowerCase())
      : [user.roles.toLowerCase()];

    const filtered = data.navMain.filter((item) => {
      if (!item.roles) return true;
      const allowedRoles = item.roles.map((r) => r.toLowerCase());
      return allowedRoles.some((role) => userRoles.includes(role));
    });

    setFilteredNavMain(filtered);
  }, [user]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Avatar>
                  <AvatarImage
                    src="/homelogo.png"
                    alt="Logo"
                    className="!size-5"
                  />
                </Avatar>
                <span className="text-base font-semibold">Poniran Kost</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
