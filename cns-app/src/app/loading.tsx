import Image from "next/image";
import loader from "@/assets/images/loader.gif";

function LoadingPage() {
  return (
    <div className="flex items-center justify-center w-full h-96">
      <Image src={loader} height={150} width={150} alt="loading..." />
    </div>
  );
}

export default LoadingPage;
