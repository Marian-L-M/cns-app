"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MainNavLinks = () => {
  const links = [
    {
      label: "Main Page",
      href: "/",
      subLinks: [
        { label: "Contents", href: "/content" },
        { label: "Featured Content", href: "/featured" },
        { label: "Store", href: "/store" },
        { label: "Donate", href: "/donate" },
      ],
    },
    {
      label: "Stories",
      href: "/stories",
      subLinks: [
        { label: "Create Story", href: "/stories/new" },
        { label: "Featured Story", href: "/stories/featured" },
        { label: "Search", href: "/stories/search" },
        { label: "Categories", href: "/stories/categories" },
        { label: "Random Story", href: "" },
      ],
    },
    {
      label: "Maps",
      href: "/maps",
      subLinks: [
        { label: "Create Map", href: "/maps/new" },
        { label: "Featured Map", href: "/maps/featured" },
        { label: "Search", href: "/maps/search" },
        { label: "Categories", href: "/maps/categories" },
        { label: "Random Map", href: "" },
      ],
    },
    {
      label: "Wiki",
      href: "/wiki",
      subLinks: [
        { label: "Create Wiki", href: "/wiki/new" },
        { label: "Featured Article", href: "/wiki/featured" },
        { label: "Search", href: "/wiki/search" },
        { label: "Categories", href: "/wiki/categories" },
        { label: "Random Article", href: "" },
      ],
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      subLinks: [
        { label: "Analytics", href: "/dashboard/analytics" },
        { label: "Settings", href: "/dashboard/settings" },
      ],
    },
    {
      label: "Users",
      href: "/users",
      subLinks: [
        { label: "Manage Users", href: "/users/manage" },
        { label: "Settings", href: "/users/settings" },
        { label: "Profile", href: "/users/profile" },
      ],
    },
  ];

  const currentPath = usePathname();

  return (
    <ul className="flex flex-col gap-6 mt-6">
      {links.map((link) => (
        <li key={link.label + "-container"}>
          <Link
            key={link.label}
            href={link.href}
            className={`navbar-link ${
              currentPath == link.href &&
              "cursor-default text-primary/70 hover:text-primary/60"
            }`}
          >
            {link.label}
          </Link>
          {link.subLinks && (
            <ul>
              {link.subLinks.map((sublink) => (
                <li key={sublink.label + "-container"}>
                  <Link
                    key={sublink.label}
                    href={sublink.href}
                    className={`ml-2 font-light navbar-link ${
                      currentPath == sublink.href &&
                      "cursor-default text-primary/70 hover:text-primary/60"
                    }`}
                  >
                    {sublink.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MainNavLinks;
