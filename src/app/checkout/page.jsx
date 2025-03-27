"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ShippingForm from "@/components/checkout/shipping-form";
import CouponForm from "@/components/checkout/coupon-form";
import Link from "next/link";
import GiftForm from "@/components/checkout/gift-form";
import XboxForm from "@/components/checkout/xbox-form";
import CheckoutSummary from "@/components/checkout/checkout-summary";
import Image from "next/image";
import { useEffect, useState } from "react";
import { OrderProvider } from "../../context/orderContext";
import { useCart } from "@/context/cartContext";
import { useCurrency } from "@/context/currencyContext";

export default function CheckoutPage() {
  const { cart, replaceCart } = useCart();
  const { currency } = useCurrency();
  const [forms, setForms] = useState({
    skin: false,
    vbucks: false,
    extra: false,
  });

  useEffect(() => {
    if (cart.length > 0) {
      cart.some((item) => item.category === "vbucks") &&
        setForms((prevState) => ({
          ...prevState,
          vbucks: true,
        }));

      cart.some(
        (item) => item.category === "skin" || item.category === "battlepass"
      ) &&
        setForms((prevState) => ({
          ...prevState,
          skin: true,
        }));

      cart.some(
        (item) => item.category === "club" || item.category === "pack"
      ) &&
        setForms((prevState) => ({
          ...prevState,
          extra: true,
        }));
    }
  }, [cart]);

  return (
    <main className="flex-1 container lg:grid lg:grid-cols-[1fr_400px] min-h-screen lg:gap-8 py-6">
      <OrderProvider>
        <div className="space-y-4">
          <Link href="/">
            <div className="flex text-sm hover:underline hover:cursor-pointer items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                color="#ffffff"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M13.5 16C13.5 16 10.5 13.054 10.5 12C10.5 10.9459 13.5 8 13.5 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Go back
            </div>
          </Link>
          <ShippingForm />
          {forms.skin && <GiftForm />}
          {(forms.vbucks || forms.extra) && <XboxForm />}
          {cart.some((e) => e.category == "download") && (
            <Card className="dark:bg-[#0A0A0A]/50 dark:text-background-foreground ">
              <CardHeader>
                <CardTitle>How it works?</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex flex-col gap-2">
                  <div>
                    <h4>Sticky Aim</h4>
                    <p className="text-gray-400 text-sm">
                      This Mod Locks Your Crosshair Onto Opponents With
                      Precision. As Demonstrated, It Flawlessly Tracks Targets
                      Even During Rapid Movements And At Long Range!
                    </p>
                  </div>
                  <div>
                    <h4>Anti Recoil</h4>
                    <p className="text-gray-400 text-sm">
                      The Anti Recoil Mod Significantly Reduces Recoil, Allowing
                      You To Hit Shots That Look Impossible. This Mod Is
                      Especially Overpowered In The Mid Range For ARs!
                    </p>
                  </div>
                  <div>
                    <h4>Headshot Mod</h4>
                    <p className="text-gray-400 text-sm">
                      The Headshot Mod Is Specifically Made To Help You Get The
                      Most Out Of Your Aim And Land Headshots With Ease! It Does
                      This By Adjusting Your Crosshair To Their Heads While
                      Seamlessly Working With The Rest Of The Mods!
                    </p>
                  </div>
                  <div>
                    <h4>Auto Tracking</h4>
                    <p className="text-gray-400 text-sm">
                      The Auto Tracking Mod Does Exactly As Its Name Suggests:
                      It Automatically Moves Your Crosshair Towards The Enemy
                      Even Without Touching Your Controller. This Is Especially
                      Useful In Close Range With SMGs And ARs!
                    </p>
                  </div>
                  <div>
                    <h4>Linear + Exponential compatibility</h4>
                    <p className="text-gray-400 text-sm">
                      This Cronus Zen Script Is Compatible With Both Linear And
                      Exponential Aim Assist, So No Matter Which Aim Assist
                      Curve You Prefer, You Can Still Get The Most Out Of This
                      Script!
                    </p>
                  </div>
                  <div>
                    <h4>Xbox, PS and PC compatibility</h4>
                    <p className="text-gray-400 text-sm">
                      This Script Is Compatible With Every Single Platform,
                      Whether New Gen Or Old Gen Xbox, PlayStation, PC, Or Even
                      Nintendo Switch!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {!cart.some((e) => e.category == "download") && <CouponForm />}
        </div>
        <div className="space-y-4 max-lg:flex max-lg:flex-col-reverse">
          <div className="hidden lg:block h-[20px]"></div>
          <CheckoutSummary />
          <Card className="dark:bg-[#0A0A0A]/50 dark:text-background-foreground">
            <CardHeader>
              <CardTitle>Items in Cart</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {cart.length > 0 ? (
                cart.map((i, index) => (
                  <div key={index} className="grid grid-cols-[64px_1fr] gap-4">
                    {i.category === "skin" ? (
                      <Image
                        src={i.image}
                        width={64}
                        height={64}
                        alt={i.name}
                        className="rounded-md object-cover object-bottom w-[64px] h-[64px]"
                      />
                    ) : (
                      <Image
                        src={i.image.url}
                        width={64}
                        height={64}
                        alt={i.name}
                        className="rounded-md object-cover object-bottom w-[64px] h-[64px]"
                      />
                    )}
                    <div>
                      {i.category === "skin" ? (
                        <Link
                          className="hover:underline"
                          href={`/shop/${i.id}`}
                        >
                          <h4 className="font-medium">{i.name}</h4>
                        </Link>
                      ) : (
                        <h4 className="font-medium">{i.name}</h4>
                      )}

                      <p className="text-sm text-muted-foreground">
                        Quantity: {i.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${(i.price * currency.price).toFixed(2)}{" "}
                        {currency.label} each
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm mx-auto">Empty</p>
              )}
            </CardContent>
          </Card>
        </div>
      </OrderProvider>
    </main>
  );
}
