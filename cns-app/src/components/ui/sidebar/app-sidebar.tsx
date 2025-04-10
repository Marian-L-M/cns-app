import {
  ChevronUp,
  Home,
  Search,
  Settings,
  User2,
  LoaderPinwheelIcon,
  MoreHorizontal,
  ChevronDown,
  Map,
  ScrollText,
  BookMarked,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../dropdown-menu";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../collapsible";
import { CustomTrigger } from "./custom-trigger";
import { BarChart } from "lucide-react";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
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
  {
    title: "Users",
    url: "/users",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <CustomTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                // Main Link
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <span className="flex justify-between p-2 gap-2">
                      <Link href={item.url} className="flex gap-2">
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
                            <Link href={option.url}>
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
                            <Link href={sublink.url}>
                              <span>{sublink.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <a href="/">
                    <LoaderPinwheelIcon />
                    <span>Active Sample</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/">
                    <LoaderPinwheelIcon />
                    <span>Badge Sample</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuBadge>24</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Home />
                    <span>Dropdown</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction>
                      <MoreHorizontal />
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    <DropdownMenuItem>
                      <span>Edit Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href={"/sub-1"}>
                        <span>Sub 1</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href={"/sub-2"}>
                        <span>Sub 2</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <a href="#">
                        <span>Dropdown</span>
                      </a>
                      <ChevronDown className="ml-auto" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href={"/sub-1"}>
                            <span>Sub 1</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu></SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  {/* <a href="/Dashboard"> */}
                  {/* <ChartBar /> */}
                  <span>Dashboard</span>
                  {/* </a> */}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu></SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
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
