import { PROJECT_NAME, PROJECT_URL } from "@/lib/constants";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="px-5 py-1 text-xs border-slate-800 border-t-1 font-light flex-center">
        <h6>
          Powered by {PROJECT_NAME} -
          <Link href={PROJECT_URL} className="text-indigo-950 hover:opacity-80">
            {" "}
            Learn more here
          </Link>
        </h6>
      </div>
    </footer>
  );
}
