"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const UserAuthForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return toast({
        title: "Email vacío",
        description: "El correo electrónico no puede estar vacío",
      });
    }
    setLoading(true);
    await signIn("email", { email });
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);
  return (
    <div className="w-11/12 sm:w-[450px] mx-auto">
      <div className="flex flex-col items-center">
        <Image
          width={300}
          height={100}
          src="/images/logonobg.webp"
          alt="logo"
          className="mb-4 block lg:hidden"
        />
        <h3 className="font-semibold text-2xl">Log in</h3>
        <p className="text-sm text-gray-400">Enter your email to log in</p>
      </div>
      <form onSubmit={handleSubmitEmail} className="mt-4">
        <Input
          id="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/40"
        >
          {loading ? (
            <svg
              className={`animate-spin mr-1 h-5 w-5 text-white`}
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
          ) : (
            "Sign in with Email"
          )}
        </Button>
      </form>
      <div className="flex items-center mt-3 justify-between">
        <Separator className="bg-gray-500 w-4/12" />
        <p className="text-xs text-gray-500 font-semibold">OR CONTINUE WITH</p>
        <Separator className="bg-gray-500 w-4/12" />
      </div>
      <div className="w-full mt-3">
        <Button
          type="button"
          onClick={() => signIn("discord")}
          className="w-full bg-[#7289da] text-white hover:bg-[#7289da]/80"
        >
          <svg
            className="mr-1"
            width={24}
            height={24}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
          >
            <path
              fill="currentColor"
              d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"
            />
          </svg>
          Discord
        </Button>
      </div>
      <p className="w-full mt-4 text-sm text-gray-400">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline hover:text-gray-300 hover:cursor-pointer"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline hover:text-gray-300 hover:cursor-pointer"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default UserAuthForm;
