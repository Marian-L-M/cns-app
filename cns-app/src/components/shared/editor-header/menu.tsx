"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EditorHeaderMenu({ menuList }: MenuListProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    // Overview always needs to be first in list for path validation
    if (path === menuList[0].url) {
      return pathname === menuList[0].url;
    }

    // Sub route active
    return pathname.startsWith(path);
  };

  return (
    <nav className="main-nav self-end flex items-end gap-4" id="main-nav">
      {menuList?.map((item) => (
        <Link
          key={`${item.title}-link`}
          href={item.url}
          className={`text-md font-semibold py-2 px-1 border-b-4 ${
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
