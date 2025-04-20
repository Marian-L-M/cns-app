import Menu from "./menu";

function Header() {
  return (
    <header className="md:pl-20 w-full flex flex-row justify-between items-center border-b bg-slate-100">
      <Menu />
    </header>
  );
}

export default Header;
