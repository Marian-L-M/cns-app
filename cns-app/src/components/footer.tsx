import { APP_NAME } from "@/lib/constants";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="px-5 py-1 text-xs border-slate-800 border-t-1 font-light flex-center">
        {currentYear} {APP_NAME}. All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
