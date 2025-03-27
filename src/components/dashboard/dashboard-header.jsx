"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

const DashboardHeader = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <div className="supports-backdrop-blur:bg-[#0A0A0A]/60 fixed left-0 right-0 top-0 z-20 border-b bg-[#0A0A0A]/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4 md:px-8">
        <div className="flex items-center w-auto gap-4">
          <div className="items-center hidden md:flex">
            <p className="font-semibold">BerlinGonzalez Shop - Dashboard</p>
          </div>
          <div className="items-center border-l border-[#C68000] pl-4 gap-6 text-sm hidden md:flex">
            <Link
              className={`${
                pathname === "/dashboard"
                  ? "text-white"
                  : "text-gray-400 hover:text-white transition-all"
              }`}
              href="/dashboard"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/orders"
              className={`${
                pathname.includes("/orders")
                  ? "text-white"
                  : "text-gray-400 hover:text-white transition-all"
              }`}
            >
              Orders
            </Link>
            <Link
              href="/dashboard/products"
              className={`${
                pathname.includes("/products")
                  ? "text-white"
                  : "text-gray-400 hover:text-white transition-all"
              }`}
            >
              Products
            </Link>
            <Link
              href="/dashboard/gift"
              className={`${
                pathname.includes("/gift")
                  ? "text-white"
                  : "text-gray-400 hover:text-white transition-all"
              }`}
            >
              Gift
            </Link>
            <Link
              href="/dashboard/accounts"
              className={`${
                pathname.includes("/accounts")
                  ? "text-white"
                  : "text-gray-400 hover:text-white transition-all"
              }`}
            >
              Accounts
            </Link>
            <Link
              className={`${
                pathname.includes("/quotes")
                  ? "text-white"
                  : "text-gray-400 hover:text-white transition-all"
              }`}
              href="/dashboard/quotes"
            >
              Quotes
            </Link>
            <Link
              className={`${
                pathname.includes("/users")
                  ? "text-white"
                  : "text-gray-400 hover:text-white transition-all"
              }`}
              href="/dashboard/users"
            >
              Users
            </Link>

            <Link
              className={`${
                pathname.includes("/coupons")
                  ? "text-white"
                  : "text-gray-400 hover:text-white transition-all"
              }`}
              href="/dashboard/coupons"
            >
              Coupons
            </Link>
          </div>
          <Sheet>
            <SheetTrigger className="block md:hidden">
              <svg
                width={25}
                height={25}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#ffffff"
                  d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
                />
              </svg>
            </SheetTrigger>
            <SheetContent side="left" className="w-full">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center">
                    <p className="ml-2">BerlinGonzalez Shop</p>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col items-start text-left mt-10 gap-6 text-sm">
                <Link
                  className={`${
                    pathname === "/dashboard"
                      ? "text-white border-l-2 border-[#C68000] pl-4"
                      : "text-gray-400 hover:text-white transition-all"
                  } text-xl`}
                  href="/dashboard"
                >
                  Overview
                </Link>
                <Link
                  href="/dashboard/products"
                  className={`${
                    pathname.includes("/products")
                      ? "text-white border-l-2 border-[#C68000] pl-4"
                      : "text-gray-400 hover:text-white transition-all"
                  } text-xl`}
                >
                  Products
                </Link>

                <Link
                  href="/dashboard/orders"
                  className={`${
                    pathname.includes("/orders")
                      ? "text-white border-l-2 border-[#C68000] pl-4"
                      : "text-gray-400 hover:text-white transition-all"
                  } text-xl`}
                >
                  Orders
                </Link>
                <Link
                  href="/dashboard/gift"
                  className={`${
                    pathname.includes("/gift")
                      ? "text-white border-l-2 border-[#C68000] pl-4"
                      : "text-gray-400 hover:text-white transition-all"
                  } text-xl`}
                >
                  Gift
                </Link>

                <Link
                  href="/dashboard/accounts"
                  className={`${
                    pathname.includes("/accounts")
                      ? "text-white border-l-2 border-[#C68000] pl-4"
                      : "text-gray-400 hover:text-white transition-all"
                  } text-xl`}
                >
                  Accounts
                </Link>
                <Link
                  href="/dashboard/quotes"
                  className={`${
                    pathname.includes("/quotes")
                      ? "text-white border-l-2 border-[#C68000] pl-4"
                      : "text-gray-400 hover:text-white transition-all"
                  } text-xl`}
                >
                  Quotes
                </Link>

                <Link
                  className={`${
                    pathname.includes("/users")
                      ? "text-white border-l-2 border-[#C68000] pl-4"
                      : "text-gray-400 hover:text-white transition-all"
                  } text-xl`}
                  href="/dashboard/users"
                >
                  Users
                </Link>
                <Link
                  href="/dashboard/coupons"
                  className={`${
                    pathname.includes("/coupons")
                      ? "text-white border-l-2 border-[#C68000] pl-4"
                      : "text-gray-400 hover:text-white transition-all"
                  } text-xl`}
                >
                  Coupons
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex items-center">
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.user.image} />
                  <AvatarFallback>
                    {session.user.name
                      ? session.user.name.charAt(0)
                      : session.user.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <div>
                    <p>
                      {session.user.name
                        ? session.user.name
                        : session.user.email.split("@")[0]}
                    </p>
                    <p className="text-xs font-normal text-gray-400">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/">Store</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </div>
  );
};

export default DashboardHeader;
