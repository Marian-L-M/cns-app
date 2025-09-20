import Image from "next/image";
import loader from "@/assets/images/loader.gif";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center w-full h-96">
      <Image src={loader} height={150} width={150} alt="loading..." />
    </div>
  );
}
