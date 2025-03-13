import Image from "next/image";
import Link from "next/link";
import MainNav from "../header/MainNav";
import { APP_NAME } from "@/lib/constants";

function Sidebar() {
  return (
    <div
      className="flex-initial w-48 flex-col gap-4  px-4 py-8 h-screen overflow-scroll"
      id="column-side"
    >
      <Link href="/" className="">
        <figure className="flex flex-col items-center gap-4">
          <Image
            src="/ui/logo.png"
            alt={`${APP_NAME} logo`}
            height={64}
            width={64}
            priority
          />
        </figure>
      </Link>
      <MainNav />
    </div>
  );
}

export default Sidebar;
