"use client";

import React, { useEffect, useState } from "react";
import { getShop } from "@/helpers/shop";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SkinProduct from "./skin-product";
import { useRouter } from "next/navigation";
import ShopDate from "../shop-date";

const ShopContainer = () => {
  const [search, setSearch] = useState("");
  const [shop, setShop] = useState([]);
  const [skinmultiplier, setskinmultiplier] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch shop data and multiplier when component mounts
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopData = await getShop();
        setShop(shopData.shop);

        const res = await fetch("/api/multiplier", { method: "GET" });
        const response = await res.json();
        if (response) {
          setskinmultiplier(response[0]);
        }
      } catch (error) {
        console.error("Error fetching shop or multiplier:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, []);

  // Filter shop items based on search and selected categories
  const filterShop = () => {
    let filteredProducts = shop?.filter((product) => {
      const productName = product.displayName.toLowerCase();
      const searchTerm = search.toLowerCase();
      // Filtra por nombre y elimina los de tipo "Music" y con precio 0
      const hasValidAssets =
        product.displayAssets.length > 0 ||
        (product.granted?.length > 0 && product.granted[0].images?.icon);

      // Filtra basándose en las condiciones
      return (
        productName.includes(searchTerm) && // Coincide con la búsqueda
        product.displayType !== "Music" && // No es "Music"
        product.price.finalPrice !== 0 && // Tiene precio válido
        hasValidAssets // Tiene assets válidos
      );
    });
    return filteredProducts;
  };

  const filteredShop = filterShop();

  return (
    <>
      {loading ? (
        // Loading spinner
        <div className="h-20 w-20 mx-auto mt-10 flex justify-center items-center">
          <svg
            className={`animate-spin mr-1 h-6/12 w-6/12 text-white`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        filteredShop && (
          <section
            id="shop"
            className="w-full min-h-screen  flex flex-col justify-center"
          >
            <div className="container">
              <ShopDate />
              <h5 className="text-2xl md:text-3xl font-bold">Today's shop</h5>
              <p className="max-w-[900px] text-gray-400 mt-2 mb-6 md:mb-8">
                Do you want a skin from the store? Want it right now? You don’t
                need to buy V-Bucks—you can purchase the skin directly and
                receive it instantly!
              </p>
            </div>
            <div className="pb-4 container">
              <div className="flex items-start flex-col md:flex-row w-full justify-between">
                <div className="w-full">
                  <Label htmlFor="skin" className="ml-1 text-md font-semibold">
                    Skin
                  </Label>
                  <div className="flex items-center justify-between w-full max-md:gap-2 flex-col md:flex-row">
                    <Input
                      id="skin"
                      className="w-full md:w-[300px]"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search skin"
                    />
                    <Button
                      onClick={() => router.push("/shop")}
                      className="md:w-auto w-full px-10 text-white bg-[#0088CC] hover:bg-[#0088CC]/80 transition-all"
                    >
                      View all items
                    </Button>
                  </div>
                </div>
              </div>

              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-[300px] sm:w-[85%] lg:w-[92%] xl:w-[95%] max-2xl:mx-auto 2xl:w-full mt-4"
              >
                <CarouselContent className="p-2">
                  {filteredShop.map(
                    (product, index) =>
                      product.price.finalPrice !== 0 &&
                      product.displayType != "Music" && (
                        <CarouselItem
                          className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                          key={index}
                        >
                          <SkinProduct
                            key={product.offerId}
                            product={product}
                            multiplier={skinmultiplier}
                          />
                        </CarouselItem>
                      )
                  )}
                </CarouselContent>
                <div className="sm:block hidden">
                  <CarouselPrevious />
                </div>
                <div className="sm:block hidden">
                  <CarouselNext />
                </div>
              </Carousel>
              <div className="w-full flex sm:hidden items-start justify-between mt-4">
                <div className="flex items-center gap-1">
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-400">Scroll to left</p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-400">Scroll to right</p>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </section>
        )
      )}
    </>
  );
};

export default ShopContainer;
