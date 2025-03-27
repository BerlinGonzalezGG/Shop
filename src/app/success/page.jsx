import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SuccessPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-gray-50 ">
      <Navbar />
      <main className="flex-1 w-full min-h-screen px-[20%] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="100"
            height="100"
            color="green"
            fill="none"
          >
            <path
              d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 12.5L10.5 15L16 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="font-semibold mb-1 text-3xl sm:text-5xl sm:text-left text-center">
            Purchase success
          </h3>
          <p className="text-gray-200 w-full sm:w-9/12 text-center text-sm sm:text-base">
            Your order was processed correctly, please wait while your orders
            are being delivering
          </p>
          <Link href="/" className="mt-2">
            <Button variant="secondary" className="min-w-[150px]">
              Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessPage;
