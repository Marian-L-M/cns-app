import React from "react";
import TopNav from "./TopNav";
import MainNav from "./MainNav";

function Header() {
  return (
    <header className="w-full flex flex-row justify-between items-center">
      {/* <MainNav /> */}
      <TopNav />
    </header>
  );
}

export default Header;
