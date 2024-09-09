import Link from "next/link";
import React from "react";

const TopNav = () => {
  return (
    <div className="w-full flex items-center gap-2">
      <Link href="/">Logout</Link>
    </div>
  );
};

export default TopNav;
