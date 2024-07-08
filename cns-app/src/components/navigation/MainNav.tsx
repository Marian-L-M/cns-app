import Link from "next/link";

function MainNav() {
  return (
    <div>
      <Link href="/">Dashboard</Link>
      <Link href="/maps">Maps</Link>
      <Link href="/wiki">Wiki</Link>
      <Link href="/users">Users</Link>
    </div>
  );
}

export default MainNav;
