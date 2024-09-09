import Image from "next/image";
import Link from "next/link";
import MainNav from "./MainNav";

function Sidebar() {
  return (
    <div className="flex flex-col gap-4 side-column w-1/5 max-w-64 bg-slate-100 px-4 py-8 h-screen overflow-scroll">
      <Link href="/" className="">
        <figure className="flex flex-col items-center gap-4">
          <Image width={128} height={128} src="/ui/logo.png" alt="logo" />
          <figcaption className="font-semibold text-lg">
            Clouds and Spaceships
          </figcaption>
        </figure>
      </Link>
      <MainNav />
    </div>
  );
}

export default Sidebar;
