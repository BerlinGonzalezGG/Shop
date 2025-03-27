"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useOrder } from "@/context/orderContext";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const GiftForm = () => {
  const [fortniteUsername, setfortniteUsername] = useState("");
  const { order, setorder } = useOrder();

  useEffect(() => {
    let updatedOrder = { ...order };

    if (fortniteUsername) {
      updatedOrder.shipping = {
        ...updatedOrder.shipping,
        fortnite: {
          ...updatedOrder.shipping?.fortnite,
          username: fortniteUsername,
        },
      };
    } else {
      if (updatedOrder.shipping) {
        delete updatedOrder.shipping.fortnite;
      }
    }
    setorder(updatedOrder);
  }, [fortniteUsername]);

  return (
    <Card className="dark:bg-[#0A0A0A]/50 dark:text-background-foreground ">
      <CardHeader>
        <CardTitle>Delivery information</CardTitle>
        <CardDescription>
          Our bot send automatically the skin to your account, so make sure you
          write your username correctly, have added it to all the bots and have
          waited 48 hours. If you don't have bots added:{" "}
          <Link href="/bot" className="hover:underline">
            Click here
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fortniteusername">Fortnite username</Label>
          <Input
            value={fortniteUsername}
            onChange={(e) => setfortniteUsername(e.target.value)}
            id="fortniteusername"
            placeholder="berlin"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GiftForm;
