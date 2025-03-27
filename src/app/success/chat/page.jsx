"use client";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

const LoadingSpinner = () => (
  <svg
    className="animate-spin mr-1 h-10 w-10 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const SuccessTransferContent = ({ orderId, totalamount, currency }) => (
  <div className="flex flex-col items-center ">
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
      Your order was processed correctly, and it will be delivered as soon as
      possible, if you don't receive your order, please contact us so you we can
      help you with the order id: #{orderId}
    </p>
    <div className="mt-2 w-full h-auto sm:flex sm:justify-center sm:items-center">
      <Link href="/" className="w-full sm:w-[100px] sm:mr-2">
        <Button variant="secondary" className="w-full">
          Home
        </Button>
      </Link>
      <div className="h-2 sm:hidden"></div>
    </div>
  </div>
);

const SuccessTransferData = ({
  setOrderId,
  setTotalAmount,
  setCurrency,
  setLoading,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const orderid = searchParams.get("orderid");
    const amount = searchParams.get("amount");
    const currency = searchParams.get("currency");
    if (!orderid) {
      router.push("/");
    } else {
      setTotalAmount(amount);
      setOrderId(orderid);
      setCurrency(currency);
      setLoading(false);
    }
  }, [
    searchParams,
    router,
    setOrderId,
    setTotalAmount,
    setCurrency,
    setLoading,
  ]);

  return null;
};

const SuccessTransferPage = () => {
  const [orderId, setOrderId] = useState();
  const [totalamount, setTotalAmount] = useState();
  const [currency, setCurrency] = useState();
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-gray-50">
      <Navbar />
      <main className="flex-1 w-full min-h-screen px-10 md:px-[20%] flex items-center justify-center">
        <Suspense fallback={<LoadingSpinner />}>
          <SuccessTransferData
            setOrderId={setOrderId}
            setTotalAmount={setTotalAmount}
            setCurrency={setCurrency}
            setLoading={setLoading}
          />
        </Suspense>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <SuccessTransferContent
            orderId={orderId}
            totalamount={totalamount}
            currency={currency}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SuccessTransferPage;
