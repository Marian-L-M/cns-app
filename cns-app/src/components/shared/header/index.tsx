import Menu from "./menu";

export default function Header() {
  return (
    <header className="md:pl-20 fixed top-0 left-0 z-10 w-full flex flex-row justify-between items-center border-b bg-slate-100 bg-opacity-80">
      <Menu />
    </header>
  );
}
