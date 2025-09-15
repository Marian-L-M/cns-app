import { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { APP_NAME } from "@/lib/constants";

interface menuItemSublink {
  title: string;
  url: string;
}

interface menuItem extends menuItemSublink {
  icon: LucideIcon;
  subLinks?: menuItemSublink[];
  options?: menuItemSublink[];
}

interface sidebarDataProps {
  menuItems: menuItem[];
}

// interface menuItemList :

export function AppSidebar({ menuItems = [] }: sidebarDataProps) {
  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="bg-gray-800 text-white"
    >
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
              {menuItems.map((item) => (
                // Main Link
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <span className="flex justify-between p-2 gap-2 hover:bg-slate-600">
                      <Link href={item.url} className="flex gap-2 flex-1">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </span>
                  </SidebarMenuButton>
                  {/* Admin actions */}
                  {item.options && (
                    <DropdownMenu>
                      <DropdownMenuContent side="right" align="start">
                        {item.options.map((option: menuItemSublink) => (
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
                      {item.subLinks.map((sublink: menuItemSublink) => (
                        <SidebarMenuSubItem key={sublink.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={sublink.url}
                              className="w-full hover:bg-slate-600"
                            >
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
      </SidebarContent>
    </Sidebar>
  );
}
