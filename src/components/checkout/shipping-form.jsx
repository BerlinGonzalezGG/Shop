"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useOrder } from "@/context/orderContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CurrencySelect from "../currency-select";

const ShippingForm = () => {
  const { order, setorder } = useOrder();
  const [email, setemail] = useState("");
  const [discord, setdiscord] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    let updatedOrder = { ...order };
    if (email) {
      updatedOrder.shipping = { ...updatedOrder.shipping, email: email };
    } else {
      if (updatedOrder.shipping) {
        delete updatedOrder.shipping.email;
      }
    }
    setorder(updatedOrder);
  }, [email]);

  useEffect(() => {
    let updatedOrder = { ...order };
    if (discord) {
      updatedOrder.shipping = { ...updatedOrder.shipping, discord: discord };
    } else {
      if (updatedOrder.shipping) {
        delete updatedOrder.shipping.discord;
      }
    }
    setorder(updatedOrder);
  }, [discord]);

  useEffect(() => {
    if (session) {
      const updatedShipping = { ...order.shipping };

      if (session.user.email) {
        setemail(session.user.email);
        updatedShipping.email = session.user.email;
      }

      if (session.user.name) {
        setdiscord(session.user.name);
        updatedShipping.discord = session.user.name;
      }

      setorder((prevOrder) => ({
        ...prevOrder,
        shipping: updatedShipping,
      }));
    }
  }, [session]);

  return (
    <Card className="dark:bg-[#0A0A0A]/50 dark:text-background-foreground ">
      <CardHeader>
        <CardTitle>
          <div className="w-full flex justify-between items-start">
            Shipping Details
            <CurrencySelect />
          </div>
        </CardTitle>
        <CardDescription>Fill inputs.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            id="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Discord</Label>
          <Input
            value={discord}
            onChange={(e) => setdiscord(e.target.value)}
            id="discord"
            placeholder="Enter your Discord"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingForm;
