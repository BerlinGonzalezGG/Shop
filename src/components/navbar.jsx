"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession, signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import Cart from "./cart";
import CurrencySelect from "./currency-select";
import { usePathname } from "next/navigation";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <header className="h-fit bg-[#000000] border-b border-[#2A2A2A] fixed w-full z-30">
      <div className="w-full bg-red-500 mb-2 text-white flex items-center justify-center font-medium text-sm md:text-base text-center">
        The store closes at 6:55 PM and reopens at 7:30 PM daily - BEFORE BUYING
        ADD OUR BOTS
      </div>
      <div className="flex justify-between items-center pb-2 px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="/">
          <Image
            alt="Logo"
            src="/images/logonobg.webp"
            width={100}
            height={48}
          />
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center ">
          <div className="flex items-center w-auto gap-2">
            <CurrencySelect />
            {/*<LangSelect />*/}
          </div>
          <Link
            className={`${
              pathname === "/" ? "text-white" : "text-gray-400"
            } text-sm hover:text-gray-200 transition-all`}
            href="/"
          >
            HOME
          </Link>
          <Link
            className={`${
              pathname === "/shop" ? "text-white" : "text-gray-400"
            } text-sm hover:text-gray-200 transition-all`}
            href="/shop"
          >
            SHOP
          </Link>
          <Link
            className={`${
              pathname === "/bot" ? "text-white" : "text-gray-400"
            } text-sm hover:text-gray-200 transition-all`}
            href="/bot"
          >
            BOT
          </Link>
          <Link
            className="text-sm hover:text-gray-200 transition-all text-gray-400"
            href="https://bit.ly/4fqnvx1"
            target="_blank"
          >
            T-SHIRTS
          </Link>
          <Link
            className={`${
              pathname === "/about" ? "text-white" : "text-gray-400"
            } text-sm hover:text-gray-200 transition-all`}
            href="/about"
          >
            ABOUT
          </Link>
          <Link
            className={`text-gray-400 text-sm hover:text-gray-200 transition-all`}
            href="/contact"
          >
            CONTACT
          </Link>
          <div
            className={`flex gap-5 items-center ${
              session ? "flex" : "flex-row-reverse"
            }`}
          >
            <Cart />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Image
                    alt="Avatar"
                    className="rounded-full hover:cursor-pointer hover:ring-2 ring-white transition-all"
                    src={
                      session.user.image
                        ? session.user.image
                        : "/profileimage.jpg"
                    }
                    width={33}
                    height={40}
                    unoptimized
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-light">
                    {session.user.name ? session.user.name : session.user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(session.user.role === "admin" ||
                    session.user.role === "mod") && (
                    <>
                      <DropdownMenuItem className="hover:cursor-pointer">
                        <Link href="/dashboard" className="w-full">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <Link href="/orders" className="w-full">
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={signOut}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-gray-200 transition-all hover:cursor-pointer"
              >
                LOGIN
              </Link>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button size="icon" variant="outline">
            <Cart />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full">
              <div className="grid p-4">
                <Link className="text-xl font-medium" href="/">
                  HOME
                </Link>
                <Separator className="my-2" />
                <Link className="text-xl font-medium" href="/shop">
                  SHOP
                </Link>
                <Separator className="my-2" />
                <Link className="text-xl font-medium" href="/bot">
                  BOT
                </Link>
                <Separator className="my-2" />
                <Link
                  target="_blank"
                  className="text-xl font-medium"
                  href="https://bit.ly/4fqnvx1"
                >
                  T-SHIRTS
                </Link>
                <Separator className="my-2" />
                <Link className="text-xl font-medium" href="/about">
                  ABOUT
                </Link>
                <Separator className="my-2" />
                <Link className="text-xl font-medium" href="/contact">
                  CONTACT
                </Link>
                <Separator className="my-2" />
                <CurrencySelect />
                <Separator className="my-2" />
                {session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="rounded-sm border flex justify-start border-gray-200 h-auto p-2 w-full dark:bg-[#2A2A2A]"
                        size="icon"
                        variant="ghost"
                      >
                        <Image
                          alt="Avatar"
                          className="rounded-sm w-12"
                          src={
                            session.user.image
                              ? session.user.image
                              : "/profileimage.jpg"
                          }
                          width={48}
                          height={48}
                          unoptimized
                        />
                        <div className="text-left ml-2">
                          <p className="font-semibold">
                            {session.user.name ? session.user.name : "User"}
                          </p>
                          <p className=" font-light text-gray-400">
                            {session.user.email}
                          </p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel className="font-light">
                        {session.user.name
                          ? session.user.name
                          : session.user.email}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(session.user.role === "admin" ||
                        session.user.role === "mod") && (
                        <>
                          <DropdownMenuItem className="hover:cursor-pointer">
                            <Link href="/dashboard">Dashboard</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem className="hover:cursor-pointer">
                        <Link href="/orders">Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="hover:cursor-pointer "
                        onClick={signOut}
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href="/login"
                    className="text-lg font-medium hover:underline underline-offset-4"
                  >
                    LOGIN
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
