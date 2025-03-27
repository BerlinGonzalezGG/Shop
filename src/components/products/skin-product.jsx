"use client";
import Image from "next/image";
import { useCart } from "@/context/cartContext";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/context/currencyContext";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

const SkinProduct = ({ product, multiplier }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { currency } = useCurrency();
  const router = useRouter();

  const imageUrl =
    product.displayAssets.length > 0
      ? product.displayAssets[0].background || product.displayAssets[0].url
      : product.granted.length > 0
      ? product.granted[0].images.icon
      : null;

  if (!imageUrl) return null;

  // Function to handle adding product to cart
  const handleAddProduct = () => {
    const p = {
      id: product.mainId,
      image: imageUrl,
      price: (product.price.finalPrice * multiplier.price).toFixed(2),
      name: product.displayName,
      category: "skin",
      offerId: product.offerId,
      quantity: 1,
      delivered: false,
    };

    addToCart(p);

    // Show a toast notification when the product is added to the cart
    toast({
      title: `Added to cart`,
      description: `Added ${product.displayName} to cart`,
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
      className="max-sm:w-full sm:min-w-[250px] hover:ring-2 ring-indigo-300 hover:cursor-pointer relative group overflow-hidden rounded-xl h-[400px]"
    >
      <div
        onClick={() => router.push(`/shop/${product.mainId}`)}
        className="w-full h-full z-10 absolute top-0 left-0 degrade"
      />
      <Image
        unoptimized
        onClick={() => router.push(`/shop/${product.mainId}`)}
        src={imageUrl}
        alt={product.displayName}
        onError={(e) => (e.target.src = "/images/image-not-found.webp")}
        fill
        priority
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="relative object-cover group-hover:brightness-110 group-hover:scale-110 transition-all object-center z-0"
      />
      <div
        onClick={() => handleAddProduct(product)}
        className="absolute z-30 group-hover:flex transition-all hidden bottom-2 group p-2 rounded-full items-center right-3"
      >
        <ShoppingCart className="text-white transition-all" />
      </div>

      <div
        onClick={() => router.push(`/shop/${product.mainId}`)}
        className="absolute z-20 bottom-5 left-5 w-full pr-10"
      >
        <h3
          title={product.displayName}
          className="font-semibold text-left truncate pr-2"
        >
          {product.displayName}
        </h3>
        <div className="flex items-center">
          <Image src="/vbucks/vbucksIcon.webp" width={18} height={0} alt="" />
          <p className="font-semibold text-gray-400 ml-1 line-through">
            {product.price.finalPrice}
          </p>
          <p className="font-semibold text-white ml-2 ">
            $
            {(
              product.price.finalPrice *
              multiplier.price *
              currency.price
            ).toFixed(2)}{" "}
            {currency.label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkinProduct;
