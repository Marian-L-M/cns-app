"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const editoMenuItems = [
  { title: "Overview", url: "/editor" },
  { title: "Stories", url: "/editor/stories" },
  { title: "Maps", url: "/editor/maps" },
  { title: "Mastermaps", url: "/editor/mastermaps" },
  { title: "Wiki", url: "/editor/wikis" },
];

function EditorHeaderMenu() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    // Overview active
    if (path === "/editor") {
      return pathname === "/editor";
    }

    // Sub route active
    return pathname.startsWith(path);
  };

  return (
    <nav className="main-nav self-end flex items-end gap-4" id="main-nav">
      {editoMenuItems.map((item) => (
        <Link
          key={`${item.title}-link`}
          href={item.url}
          className={`text-xl font-semibold py-2 px-1 border-b-4 ${
            isActive(item.url)
              ? "border-orange-600"
              : "border-transparent hover:opacity-80"
          } `}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export default EditorHeaderMenu;
