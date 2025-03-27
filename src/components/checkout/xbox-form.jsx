"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useOrder } from "@/context/orderContext";
import { useEffect, useState } from "react";
import Link from "next/link";

const XboxForm = () => {
  const [xbox, setxbox] = useState({
    email: "",
    password: "",
  });
  const { order, setorder } = useOrder();

  useEffect(() => {
    let updatedOrder = { ...order };

    updatedOrder.shipping = {
      ...updatedOrder.shipping,
      xbox: {
        email: xbox.email,
        password: xbox.password,
      },
    };
    setorder(updatedOrder);
  }, [xbox]);

  return (
    <Card className="dark:bg-[#0A0A0A]/50 dark:text-background-foreground ">
      <CardHeader>
        <CardTitle>Delivery Method</CardTitle>
        <p className="text-sm text-gray-400 mt-2 pb-2">
          Delivery may take up to 24 hours but we will try to deliver as soon as
          possible. Please keep an eye on the contact methods you shared with us
          in case we need any codes.
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm -mt-6 text-gray-400">
          Please make sure you do not have a linked XBOX account or restriction.
          If possible, disable 2FA or keep an eye out for codes.
          <Link
            target="_blank"
            className="text-blue-400 hover:underline transition-all hover:text-blue-300"
            href="https://www.epicgames.com/help/en-US/wizards/w4"
          >
            (check HERE)
          </Link>
        </p>
        <div className="mt-2">
          <label
            htmlFor="epicemail"
            className="block text-sm font-medium leading-6 text-white"
          >
            Epic Games Email
          </label>
          <div className="mt-2">
            <input
              id="epicemail"
              name="epicemail"
              value={xbox.email}
              onChange={(e) =>
                setxbox((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
              type="text"
              placeholder={"Your epic email"}
              autoComplete="epicemail"
              className="block px-3 w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-800 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="mt-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-white"
          >
            Epic Games Password
          </label>
          <div className="mt-2">
            <input
              id="epicpassword"
              value={xbox.password}
              onChange={(e) =>
                setxbox((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
              name="epicpassword"
              type="password"
              placeholder={"Your epic password"}
              className="block px-3 w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-800 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default XboxForm;
