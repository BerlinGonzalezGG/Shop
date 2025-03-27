"use client";
import Image from "next/image";
import { useCart } from "@/context/cartContext";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/context/currencyContext";
import { ToastAction } from "@/components/ui/toast";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

const FortniteProduct = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { currency } = useCurrency();
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
    <div
      key={product.id}
      className={`w-full sm:w-[250px] hover:ring-2 ring-indigo-300 hover:cursor-pointer relative group overflow-hidden rounded-xl h-[400px]`}
    >
      <div
        onClick={handleAddProduct}
        className="w-full h-full z-10 absolute top-0 left-0 degrade"
      />
      <Image
        src={product.image.url}
        alt={product.name}
        fill
        loading="eager"
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => (e.target.src = "/images/image-not-found.webp")}
        className="relative object-cover group-hover:brightness-110 group-hover:scale-110 transition-all object-center z-0"
      />

      <div
        onClick={() => handleAddProduct(product)}
        className="absolute z-30 group-hover:flex transition-all hidden bottom-2 group p-2 rounded-full items-center right-3"
      >
        <ShoppingCart className="text-white transition-all" />
      </div>

      <div
        onClick={() => handleAddProduct(product)}
        className="absolute z-20 bottom-5 left-5 w-full pr-10"
      >
        <p className="group-hover:block opacity-0 group-hover:opacity-100 font-semibold text-sm transition-all">
          {product.category == "vbucks"
            ? "VBUCKS"
            : product.category == "pack"
            ? "PACKS"
            : product.category == "club"
            ? "CREW"
            : "lol"}
        </p>
        <h3
          title={product.name}
          className="text-left truncate pr-2 text-xl font-bold h-[26px]"
        >
          {product.name}
        </h3>

        <div className="flex items-center">
          <Image
            src="/vbucks/vbucksIcon.webp"
            width={18}
            height={0}
            alt="vbucks"
          />
          <p className="text-gray-400 ml-1 font-bold h-[25px] line-through">
            {product.name.split(" ")[0]}
          </p>
          <p className="text-white ml-2 font-bold h-[25px]">
            ${(product.price * currency.price).toFixed(2)} {currency.label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FortniteProduct;
