"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useOrder } from "@/context/orderContext";
import { useState } from "react";
import { useCart } from "@/context/cartContext";

const CouponForm = () => {
  const [coupon, setcoupon] = useState("");
  const { cart } = useCart();
  const { order, setorder } = useOrder();
  const { toast } = useToast();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (coupon.trim() === "") {
      return toast({
        title: `Coupon empty`,
        description: "Coupon can't be empty",
      });
    }

    if (cart.find((e) => e.category != "skin")) {
      return toast({
        title: `Coupon error`,
        description: "Coupon only works on skins",
      });
    }

    const res = await fetch(`/api/coupon/exchange/${coupon}`, {
      method: "GET",
    });
    const data = await res.json();
    if (data.discount) {
      let updatedOrder = { ...order };
      updatedOrder.discount = {
        ...updatedOrder.discount,
        coupon,
        id: data._id,
        value: data.discount,
      };
      setorder(updatedOrder);
      return toast({
        title: "Perfect",
        description: "You have used a discount",
      });
    } else {
      return toast({
        title: "Error",
        description: "Coupon invalid",
      });
    }
  };

  return (
    <Card className="dark:bg-[#0A0A0A]/50 dark:text-background-foreground ">
      <CardHeader>
        <CardTitle>Promo Code</CardTitle>
        <CardDescription>Fill inputs.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <form onSubmit={handleApplyCoupon} className="flex">
          <Input
            onChange={(e) => setcoupon(e.target.value)}
            placeholder="Enter promo code"
            disabled={order.discount.value ? true : false}
            className="flex-1"
          />
          <Button
            disabled={order.discount.value ? true : false}
            type="submit"
            variant="outline"
            className="ml-2"
          >
            Apply
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CouponForm;
