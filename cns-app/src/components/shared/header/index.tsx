import Menu from "./menu";
import TopNav from "./TopNav";

function Header() {
  return (
    <header className="w-full flex flex-row justify-between items-center">
      {/* <TopNav /> */}
      <Menu />
    </header>
  );
}

export default Header;
