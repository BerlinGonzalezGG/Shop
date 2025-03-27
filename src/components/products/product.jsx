"use client";
import Image from "next/image";
import { useCart } from "@/context/cartContext";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/context/currencyContext";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { DollarSign, ShoppingCart } from "lucide-react";

const Producto = ({ product }) => {
  const { addToCart, cart } = useCart();
  const { currency } = useCurrency();
  const { toast } = useToast();
  const router = useRouter();
  const handleAddProduct = async () => {
    const p = {
      id: product._id,
      image: product.image,
      price: product.price,
      alternativeprice: product.alternativeprice,
      name: product.name,
      category: product.category,
      quantity: 1,
    };
    if (product.category === "download") {
      p.download = product.download;
    }
    addToCart(p);
    toast({
      title: `Added to cart`,
      description: `Added ${product.name} to cart`,
      action: (
        <ToastAction
          onClick={() => router.push("/checkout")}
          altText="Go to checkout"
        >
          Checkout
        </ToastAction>
      ),
    });
  };

  return (
    <>
      <div
        key={product.id}
        className={`bg-[#1A1A1A] rounded-lg w-[275px] mx-auto overflow-hidden shadow-lg flex flex-col justify-between`}
      >
        <Image
          src={product.image.url}
          alt={product.name}
          width={275}
          height={400}
          loading="lazy"
          className="h-[412px] object-cover object-bottom"
        />
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3
              title={product.name}
              className="text-lg font-semibold mb-2 truncate"
            >
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              {product.category === "vbucks"
                ? "Recharge V-Bucks in your account now!"
                : product.category === "club"
                ? "Activate Fortnite Club in your account now!"
                : product.category === "pack"
                ? "Get your pack in your account now!"
                : product.category === "battlepass"
                ? "Get the battle pass in your account now!"
                : "Best Script for Cronus Zen Fortnite!"}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-muted-foreground text-sm font-semibold">
              ${(product.price * currency.price).toFixed(2)} {currency.label}
            </p>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={handleAddProduct}
                      className="flex items-center gap-2 hover:bg-[#2A2A2A] p-2 hover:cursor-pointer rounded-full transition-all"
                    >
                      <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    onClick={handleAddProduct}
                    className="hover:cursor-pointer hover:bg-[#2A2A2A] transition-all flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                    <p>Add to cart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => {
                        handleAddProduct();
                        router.push("/checkout");
                      }}
                      className="flex items-center gap-2 hover:bg-[#2A2A2A] p-2 hover:cursor-pointer rounded-full transition-all"
                    >
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    onClick={() => {
                      handleAddProduct();
                      router.push("/checkout");
                    }}
                    className="hover:cursor-pointer hover:bg-[#2A2A2A] transition-all flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <p>Buy now</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Producto;
