import Image from "next/image";
import Link from "next/link";
import MainNav from "../header/MainNav";

function Sidebar() {
  return (
    <div
      className="flex-initial w-48 flex-col gap-4  px-4 py-8 h-screen overflow-scroll"
      id="column-side"
    >
      <Link href="/" className="">
        <figure className="flex flex-col items-center gap-4">
          <Image width={64} height={64} src="/ui/logo.png" alt="logo" />
        </figure>
      </Link>
      <MainNav />
    </div>
  );
}

export default Sidebar;
