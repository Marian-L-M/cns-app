import { APP_NAME } from "@/lib/constants";

import {
  ChevronUp,
  Home,
  User2,
  MoreHorizontal,
  Map,
  ScrollText,
  BookMarked,
  UserCircle,
  User2Icon,
  BarChart,
  BarChartHorizontal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../dropdown-menu";
import Link from "next/link";
import { CustomTrigger } from "./custom-trigger";

const items = [
  {
    title: "Wiki",
    url: "/wiki",
    icon: BookMarked,
    subLinks: [
      { title: "Featured", url: "/wiki/featured" },
      { title: "Search", url: "/wiki/search" },
      { title: "Categories", url: "/wiki/categories" },
      { title: "Random", url: "" },
    ],
    options: [
      { title: "Add", url: "/wiki/new" },
      { title: "Manage", url: "/wiki/" },
    ],
  },
  {
    title: "Stories",
    url: "/stories",
    icon: ScrollText,
    subLinks: [
      { title: "Featured", url: "/stories/featured" },
      { title: "Search", url: "/stories/search" },
      { title: "Categories", url: "/stories/categories" },
      { title: "Random", url: "" },
    ],
    options: [
      { title: "Add", url: "/stories/new" },
      { title: "Manage", url: "/stories/" },
    ],
  },
  {
    title: "Maps",
    url: "/maps",
    icon: Map,
    subLinks: [
      { title: "Featured", url: "/maps/featured" },
      { title: "Search", url: "/maps/search" },
      { title: "Categories", url: "/maps/categories" },
      { title: "Random", url: "" },
    ],
    options: [
      { title: "Add", url: "/maps/new" },
      { title: "MasterMaps", url: "/maps/mastermaps" },
      { title: "Manage", url: "/maps/" },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <Link
          href={"/#"}
          className="gap-2 py-2 w-full flex items-center"
          id="logo-wrapper"
        >
          <Image
            id="logo"
            src="/ui/logo.png"
            alt={`${APP_NAME} logo`}
            height={32}
            width={32}
            priority
          />
          <span className="text-xs">{APP_NAME}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <CustomTrigger />
              </SidebarMenuItem>
              {items.map((item) => (
                // Main Link
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <span className="flex justify-between p-2 gap-2 hover:bg-slate-100">
                      <Link href={item.url} className="flex gap-2 flex-1">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </span>
                  </SidebarMenuButton>
                  {/* Admin actions */}
                  {item.options && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        {item.options.map((option) => (
                          <DropdownMenuItem key={option.title}>
                            <Link href={option.url} className="w-full">
                              <span>{option.title}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  {/* Sublinks */}
                  {item.subLinks && (
                    <SidebarMenuSub>
                      {item.subLinks.map((sublink) => (
                        <SidebarMenuSubItem key={sublink.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={sublink.url} className="w-full">
                              <span className="">{sublink.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Admin content */}
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span className="flex justify-between p-2 gap-2 hover:bg-slate-100">
                    <Link href={`/dashboard`} className="flex gap-2 flex-1">
                      <BarChartHorizontal size={18} />
                      <span>Dashboard</span>
                    </Link>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span className="flex justify-between p-2 gap-2 hover:bg-slate-100">
                    <Link href={`/users`} className="flex gap-2 flex-1">
                      <User2Icon size={18} />
                      <span>Users</span>
                    </Link>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <UserCircle /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={`/account`} className="flex gap-2">
                      <span>Account</span>
                    </Link>
                  </SidebarMenuButton>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={`/profile`} className="flex gap-2">
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={`/settings`} className="flex gap-2">
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={`/sign-out`} className="flex gap-2">
                      <span>Sign out</span>
                    </Link>
                  </SidebarMenuButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
