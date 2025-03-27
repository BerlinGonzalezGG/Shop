"use client";

import Producto from "@/components/products/product";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCurrency } from "@/context/currencyContext";

const scrolltoHash = function (element_id) {
  const element = document.getElementById(element_id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }
};

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vbucksAmount, setvbucksAmount] = useState(0);
  const [nonShownProducts, setnonShownProducts] = useState([]);
  const { currency } = useCurrency();
  const [multiplier, setMultiplier] = useState(0);

  const getMultiplier = async () => {
    const res = await fetch("/api/multiplier", { method: "GET" });
    const response = await res.json();
    if (response) {
      setMultiplier(response[0]);
    }
  };

  const getProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "GET",
      });
      const resJson = await res.json();
      const productsShown = resJson.filter((e) => e.status === true);
      setProducts(productsShown);
      setnonShownProducts(resJson.filter((e) => e.category === "vbucks"));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMultiplier();
    getProducts();
  }, []);

  // Ordena los productos según la propiedad `order` dentro de cada categoría
  const vbucksProducts = products
    .filter((product) => product.category === "vbucks")
    .sort((a, b) => a.order - b.order);

  const packProducts = products
    .filter((product) => product.category === "pack")
    .sort((a, b) => a.order - b.order);

  const clubProducts = products
    .filter((product) => product.category === "club")
    .sort((a, b) => a.order - b.order);

  const battlepassProducts = products
    .filter((product) => product.category === "battlepass")
    .sort((a, b) => a.order - b.order);

  const downloadProducts = products
    .filter((product) => product.category === "download")
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {loading ? (
        <svg
          className="animate-spin mx-auto mt-4 h-10 w-10 text-white"
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
      ) : (
        <>
          {vbucksProducts.length > 0 && (
            <>
              <section className="mb-12 sm:min-h-[600px] md:mb-16 sm:flex-row flex-col-reverse container flex items-center max-sm:gap-4 sm:justify-between">
                <div className="w-full sm:w-6/12">
                  <div>
                    <h5 className="text-2xl md:text-3xl font-bold">
                      V-Bucks Calculator
                    </h5>
                    <p className="max-w-[900px] text-gray-400 mt-2 mb-2">
                      Calculate and compare the price of V-Bucks between
                      Fortnite and our Shop.
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      onChange={(e) => setvbucksAmount(e.target.value)}
                      placeholder="Amount of V-Bucks"
                    />
                    <Button
                      onClick={() => scrolltoHash("vbucks")}
                      variant="outline"
                      className="sm:px-10 text-sm"
                    >
                      Buy $
                      {(
                        multiplier.price * // Usar precio de 13500 V-Bucks en adelante
                        vbucksAmount *
                        currency.price
                      ).toFixed(2)}{" "}
                      {currency.label}
                    </Button>
                  </div>
                </div>
                <div className="w-[200px] sm:w-[275px] vbuckFloat h-[200px] sm:h-[275px]">
                  <Image
                    src="/images/vbuck.webp"
                    className="w-full h-full object-cover brightness-75"
                    width={100}
                    height={100}
                  />
                </div>
              </section>
              <section id="vbucks" className="mb-12 md:mb-16 container">
                <h2 className="text-2xl md:text-3xl font-bold">
                  V-Bucks Top Up
                </h2>
                <p className="max-w-[900px] text-gray-400 mb-6 md:mb-8">
                  Get the cheapest V-Bucks available topped up safely to your
                  account!
                </p>
                <div
                  className={`grid grid-cols-1 ${
                    vbucksProducts.length == 2 && "sm:grid-cols-2"
                  } ${
                    vbucksProducts.length == 3 &&
                    "sm:grid-cols-2 md:grid-cols-3"
                  } ${
                    vbucksProducts.length >= 4 &&
                    "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  } gap-6 md:gap-8`}
                >
                  {vbucksProducts.map((product, index) => (
                    <Producto
                      product={JSON.parse(JSON.stringify(product))}
                      key={index}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {clubProducts.length > 0 && (
            <>
              <section className="mb-12 md:mb-16 container">
                <h2 className="text-2xl md:text-3xl font-bold">CREW</h2>
                <p className="max-w-[900px] text-gray-400 mb-6 md:mb-8">
                  Get the cheapest Crew available topped up safely to your
                  account!
                </p>
                <div
                  className={`grid grid-cols-1 ${
                    clubProducts.length == 2 && "sm:grid-cols-2"
                  } ${
                    clubProducts.length == 3 && "sm:grid-cols-2 md:grid-cols-3"
                  } ${
                    clubProducts.length >= 4 &&
                    "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  } gap-6 md:gap-8`}
                >
                  {clubProducts.map((product, index) => (
                    <Producto
                      product={JSON.parse(JSON.stringify(product))}
                      key={index}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {packProducts.length > 0 && (
            <>
              <div className="container">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Fortnite Pack
                </h2>
                <p className="max-w-[900px] text-gray-400 mb-6 md:mb-8">
                  Prepare your tactics with the best Fortnite Packs in your own
                  account. Create, play, and battle with friends for free in
                  Fortnite.
                </p>

                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-[300px] sm:w-[85%] lg:w-[92%] xl:w-[95%] max-2xl:mx-auto 2xl:w-full mt-4"
                >
                  <CarouselContent className="p-2">
                    {packProducts.map((e, index) => (
                      <CarouselItem
                        className={`${
                          packProducts.length == 2 && "md:basis-1/2"
                        } ${
                          packProducts.length == 3 &&
                          "md:basis-1/2 lg:basis-1/3"
                        } ${
                          packProducts.length >= 4 &&
                          "md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                        }`}
                        key={index}
                      >
                        <Producto
                          product={JSON.parse(JSON.stringify(e))}
                          key={index}
                        />
                      </CarouselItem>
                    ))}
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
            </>
          )}

          {battlepassProducts.length > 0 && (
            <>
              <section className="mt-12 md:mt-16 container">
                <h2 className="text-2xl md:text-3xl font-bold">Battle Pass</h2>
                <p className="max-w-[900px] text-gray-400 mb-6 md:mb-8">
                  Get the Fortnite Battle Pass into your own account!
                </p>
                <div
                  className={`grid grid-cols-1 ${
                    battlepassProducts.length == 2 && "sm:grid-cols-2"
                  } ${
                    battlepassProducts.length == 3 &&
                    "sm:grid-cols-2 md:grid-cols-3"
                  } ${
                    battlepassProducts.length >= 4 &&
                    "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  } gap-6 md:gap-8`}
                >
                  {battlepassProducts.map((product, index) => (
                    <Producto
                      product={JSON.parse(JSON.stringify(product))}
                      key={index}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {downloadProducts.length > 0 && (
            <>
              <section className="mt-12 md:mt-16 container">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Cronus Zen Scripts
                </h2>
                <p className="max-w-[900px] text-gray-400 mb-6 md:mb-8">
                  Best Cronus Zen Scripts for Fortnite
                </p>
                <div
                  className={`grid grid-cols-1 ${
                    downloadProducts.length == 2 && "sm:grid-cols-2"
                  } ${
                    downloadProducts.length == 3 &&
                    "sm:grid-cols-2 md:grid-cols-3"
                  } ${
                    downloadProducts.length == 3 &&
                    "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  } gap-6 md:gap-8`}
                >
                  {downloadProducts.map((product, index) => (
                    <Producto
                      product={JSON.parse(JSON.stringify(product))}
                      key={index}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ProductContainer;
