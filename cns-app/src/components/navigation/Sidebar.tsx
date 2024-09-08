import Image from "next/image";
import Link from "next/link";

function Sidebar() {
  return (
    <div className="flex flex-col gap-4 side-column w-1/6 max-w-64 bg-slate-100 px-4 py-8 h-screen overflow-scroll">
      <Link href="/">
        <Image width={128} height={128} src="/ui/logo.png" alt="logo" />
      </Link>
    </div>
  );
}

export default Sidebar;
