"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/context/orderContext";
import { useState, useEffect, use } from "react";
import { useToast } from "../ui/use-toast";
import { useCart } from "@/context/cartContext";
import { useCurrency } from "@/context/currencyContext";
import Spin from "../spin";
import { getCsrfToken } from "next-auth/react";
const CheckoutSummary = () => {
  const { cart } = useCart();
  const { order } = useOrder();
  const { currency } = useCurrency();
  const { toast } = useToast();
  const [subtotal, setsubtotal] = useState(0);
  const [stripefee, setstripefee] = useState(0);
  const [discount, setdiscount] = useState(0);
  const [total, settotal] = useState(0);
  const [submitting, setsubmitting] = useState(false);
  const [method, setmethod] = useState("");
  const [orderStatus, setorderStatus] = useState(false);
  const [forms, setforms] = useState({
    skin: false,
    vbucks: false,
    extra: false,
  });

  const getOrderStatus = async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) {
        throw new Error("Failed to fetch settings");
      }
      const response = await res.json();
      setorderStatus(response[0].order);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      cart.some((item) => item.category === "vbucks") &&
        setforms((prevState) => ({
          ...prevState,
          vbucks: true,
        }));

      cart.some((item) => item.category === "skin" || item.category === "battlepass") &&
        setforms((prevState) => ({
          ...prevState,
          skin: true,
        }));

      cart.some(
        (item) => item.category === "club" || item.category === "pack"
      ) &&
        setforms((prevState) => ({
          ...prevState,
          extra: true,
        }));
    }
  }, [cart]);

  useEffect(() => {
    getOrderStatus();
  }, []);

  const handleCheckout = async (method) => {
    if (!orderStatus) {
      return toast({
        title: `Error`,
        description: "Orders were temporarily disabled, please try again later",
      });
    }
    order.items = cart;
    order.currency = currency;
    order.status = false;
    order.payment.method = method;
    order.payment.status = false;
    order.timestamp = new Date();
    if (order.items.length == 0) {
      return toast({
        title: `Error`,
        description: "Add products to cart",
      });
    }

    if (!order.shipping.email) {
      return toast({
        title: `Error`,
        description: "Fill your email",
      });
    }

    if (forms.skin && !order.shipping.fortnite) {
      return toast({
        title: `Error`,
        description: "Put your fortnite username",
      });
    }

    if (
      (forms.vbucks || forms.extra) &&
      (order.shipping.xbox.email.trim() == "" ||
        order.shipping.xbox.password.trim() == "")
    ) {
      return toast({
        title: `Error`,
        description: "Please fill the form",
      });
    }

    setsubmitting(true);
    const res = await fetch(`/api/checkout/${order.payment.method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": await getCsrfToken(),
      },
      body: JSON.stringify({ order }),
    });

    if (order.payment.method === "stripe") {
      const session = await res.json();
      if (session.message) return;
      if (session.url) {
        setsubmitting(false);
        window.location = session.url;
      }
    } else if (order.payment.method === "crypto") {
      const session = await res.json();
      if (session.message) return;
      if (session.result.url) {
        setsubmitting(false);
        window.location = session.result.url;
      }
    }
  };

  const calculateTotal = async () => {
    let newTotal = 0;
    cart.forEach((product) => {
      newTotal += Number(product.price) * product.quantity * currency.price;
    });
    return newTotal;
  };

  useEffect(() => {
    const updateTotals = async () => {
      const cartTotal = await calculateTotal();
      setsubtotal(cartTotal);

      if (order.discount && order.discount.value) {
        const discountValue = parseFloat(
          (cartTotal * order.discount.value) / 100
        );
        setdiscount(discountValue);
      } else {
        setdiscount(0);
      }

      let totalValue = cartTotal;

      if (order.discount && order.discount.value) {
        totalValue -= parseFloat((cartTotal * order.discount.value) / 100);
      }
      settotal(totalValue);
      const stripeFee =
        (totalValue * (currency.value === "usd" ? 2.6 : 3.5)) / 100 +
        0.3 * currency.price;
      setstripefee(stripeFee);
    };

    updateTotals();
  }, [cart, currency, order]);

  return (
    <Card className="dark:bg-[#0A0A0A]/50 dark:text-background-foreground ">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>
              ${subtotal.toFixed(2)} {currency.label}
            </span>
          </div>

          {order.discount.value && (
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>
                -${discount.toFixed(2)} {currency.label}
              </span>
            </div>
          )}
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between font-medium">
          <span>Total</span>
          <span>
            ${total.toFixed(2)} {currency.label}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full gap-2">
          <Button
            onClick={() => {
              setmethod("stripe");
              handleCheckout("stripe");
            }}
            disabled={submitting}
            className="w-full bg-[#5433FF] hover:bg-[#5433FF]/70 text-white"
          >
            {submitting && method == "stripe" ? (
              <Spin className="w-5 h-5" />
            ) : (
              <>
                Pay with Stripe{" "}
                {cart.length != 0 && (
                  <>
                    + (${stripefee.toFixed(2)}
                    {currency.label})
                  </>
                )}
              </>
            )}
          </Button>

          {/* 
          <Button
            onClick={() => {
              setmethod("crypto");
              handleCheckout("crypto");
            }}
            disabled={submitting}
            className="w-full bg-black hover:bg-[#111] text-white"
          >
            {submitting && method == "crypto" ? (
              <Spin className="w-5 h-5" />
            ) : (
              "Pay with Cryptomus"
            )}
          </Button>
          */}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CheckoutSummary;
