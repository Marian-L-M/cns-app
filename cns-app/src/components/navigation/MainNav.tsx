import Link from "next/link";
import ToggleMode from "../ToggleMode";

function MainNav() {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <Link href="/">Dashboard</Link>
        <Link href="/maps">Maps</Link>
        <Link href="/wiki">Wiki</Link>
        <Link href="/users">Users</Link>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/">Logout</Link>
        <ToggleMode />
      </div>
    </div>
  );
}

export default MainNav;
