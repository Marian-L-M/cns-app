import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import UserButton from "../header/user-button";
import EditorHeaderMenu from "./menu";

export default function EditorHeader({ menuList, settings }: MenuListProps) {
  const logo = settings?.find((item) => item.type === "logo");
  const name = settings?.find((item) => item.type === "name");

  return (
    <header className="border-b w-full flex items-center justify-between px-6">
      <div className="nav-wrapper flex gap-16">
        <Link href="/" className="w-22  py-2">
          {logo && (
            <Image
              src={logo.value}
              height={48}
              width={48}
              alt={name?.value ? name?.value : APP_NAME}
            />
          )}
        </Link>
        <EditorHeaderMenu menuList={menuList} />
      </div>
      <UserButton />
    </header>
  );
}
