"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useEffect, useState, useRef } from "react";
import { getShop } from "@/helpers/shop";
import Image from "next/image";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import { useCurrency } from "@/context/currencyContext";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const ShopIdPage = ({ params }) => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageUrl, setimageUrl] = useState("");
  const { addToCart } = useCart();
  const { currency } = useCurrency();
  const { toast } = useToast();
  const router = useRouter();

  const [multiplier, setMultiplier] = useState(null);

  const fetchItem = async () => {
    const shopData = await getShop();
    const productFounded = shopData.shop.find((e) => e.mainId === params.id);
    if (!productFounded) {
      console.error("Product not found");
      return;
    }
    setProduct(productFounded);
    setimageUrl(
      productFounded.displayAssets.length > 0
        ? productFounded.displayAssets[0].background ||
            productFounded.displayAssets[0].url
        : productFounded.granted.length > 0
        ? productFounded.granted[0].images.icon
        : null
    );
    const res = await fetch("/api/multiplier", { method: "GET" });
    const response = await res.json();
    if (response) {
      setMultiplier(response[0]);
    }
    setLoading(false);
  };

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

  const breadcrumbItems = [
    { title: "Shop", link: `/shop` },
    { title: `${product.displayName}`, link: `/shop/${product.mainId}` },
  ];

  const seasons = [
    {
      1: [
        { season: "1", start: "2017-10-25", end: "2017-12-13" },
        { season: "2", start: "2017-12-14", end: "2018-02-21" },
        { season: "3", start: "2018-02-22", end: "2018-04-30" },
        { season: "4", start: "2018-05-01", end: "2018-07-12" },
        { season: "5", start: "2018-07-12", end: "2018-09-27" },
        { season: "6", start: "2018-09-27", end: "2018-12-06" },
        { season: "7", start: "2018-12-06", end: "2019-02-28" },
        { season: "8", start: "2019-02-28", end: "2019-05-09" },
        { season: "9", start: "2019-05-09", end: "2019-08-01" },
        { season: "10", start: "2019-08-01", end: "2019-10-13" },
      ],
    },
    {
      2: [
        { season: "1", start: "2019-10-15", end: "2020-02-20" },
        { season: "2", start: "2020-02-20", end: "2020-06-17" },
        { season: "3", start: "2020-06-17", end: "2020-08-27" },
        { season: "4", start: "2020-08-27", end: "2020-12-01" },
        { season: "5", start: "2020-12-02", end: "2021-03-15" },
        { season: "6", start: "2021-03-16", end: "2021-06-07" },
        { season: "7", start: "2021-06-08", end: "2021-09-12" },
        { season: "8", start: "2021-09-13", end: "2021-12-04" },
      ],
    },
    {
      3: [
        { season: "1", start: "2021-12-05", end: "2022-03-19" },
        { season: "2", start: "2022-03-19", end: "2022-06-04" },
        { season: "3", start: "2022-06-05", end: "2022-09-17" },
        { season: "4", start: "2022-09-18", end: "2022-12-04" },
      ],
    },
    {
      4: [
        { season: "1", start: "2022-12-04", end: "2023-03-10" },
        { season: "2", start: "2023-03-10", end: "2023-06-09" },
        { season: "3", start: "2023-06-09", end: "2023-08-25" },
        { season: "4", start: "2023-08-25", end: "2023-11-03" },
      ],
    },
    {
      5: [
        { season: "OG", start: "2023-11-03", end: "2023-12-02" },
        { season: "2", start: "2023-12-03", end: "2024-03-08" },
        { season: "3", start: "2024-03-08", end: "2024-05-24" },
        { season: "4", start: "2024-05-24", end: "2024-08-16" },
        { season: "5", start: "2024-08-16", end: "TBA" },
      ],
    },
  ];

  function findSeasonByDate(date) {
    const targetDate = new Date(date);

    for (const chapter of seasons) {
      // Get the first key of the chapter object (e.g., "chapterOne")
      const chapterKey = Object.keys(chapter)[0];
      const chapterSeasons = chapter[chapterKey];

      for (const season of chapterSeasons) {
        const startDate = new Date(season.start);
        const endDate =
          season.end === "TBA" ? new Date() : new Date(season.end);

        if (targetDate >= startDate && targetDate <= endDate) {
          return `Chapter ${chapterKey} - Season ${season.season}`;
        }
      }
    }

    return "Unknown"; // No matching season found
  }

  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-gray-50">
      <Navbar />
      <main className="flex-1 w-full container pt-[100px] pb-[100px] flex flex-col">
        {loading ? (
          <div className="flex flex-col md:flex-row items-stretch justify-center w-full gap-2">
            <div className="h-full flex">
              <div className="w-full md:w-auto md:max-w-[500px]">
                <div className="animate-pulse w-[500px] h-[500px] rounded-lg bg-gray-800"></div>
              </div>
            </div>
            <div className="md:px-4 md:min-w-72 flex flex-col justify-between">
              <div className="mb-4">
                <div className="w-24 h-6 bg-gray-800 rounded mb-2 animate-pulse"></div>
                <div className="w-[500px] h-10 bg-gray-800 rounded mb-2 animate-pulse"></div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-20 h-6 bg-gray-800 rounded animate-pulse"></div>
                  <div className="w-24 h-6 bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div className="w-48 h-6 bg-gray-800 rounded mb-2 animate-pulse"></div>
                <div className="w-48 h-6 bg-gray-800 rounded mb-2 animate-pulse"></div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Array(3)
                    .fill()
                    .map((_, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 bg-gray-800 rounded-lg animate-pulse"
                      ></div>
                    ))}
                </div>
              </div>

              <div className="w-full mt-4">
                <div className="w-48 h-6 bg-gray-800 rounded mb-2 animate-pulse"></div>
                <div className="w-full h-10 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <BreadCrumb items={breadcrumbItems} />
            <div className="flex flex-col md:flex-row items-stretch justify-center w-full gap-2">
              <div className="h-full flex">
                <div className="w-full md:w-auto md:max-w-[500px]">
                  <Image
                    src={imageUrl}
                    alt={product.displayName}
                    width={500}
                    height={300}
                    className="object-cover lg:w-[500px] w-[400px] h-[400px] lg:h-[500px] object-center rounded-lg"
                  />
                </div>
              </div>
              <div className="md:px-4 md:min-w-72 flex flex-col justify-between">
                <div>
                  <p className=" font-bold">{product.displayType}</p>
                  <h4 className=" font-extrabold text-5xl max-w-80">
                    {product.displayName
                      ? product.displayName
                      : "Name not found"}
                  </h4>
                  <div className="flex items-start gap-1 mt-2 ">
                    <div className="flex items-start">
                      <Image
                        src="/vbucks/vbucksIcon.webp"
                        width={20}
                        className="mt-[2px]"
                        height={0}
                        alt="vbucks"
                      />
                      <p className="ml-[2px] line-through text-gray-400 font-bold">
                        {product.price.finalPrice}
                      </p>
                    </div>
                    <p className="font-bold">
                      $
                      {(
                        product.price.finalPrice *
                        multiplier.price *
                        currency.price
                      ).toFixed(2)}{" "}
                      {currency.label}
                    </p>
                  </div>
                  <p className="max-w-[450px] text-sm my-2">
                    {product.displayDescription}
                  </p>
                  <p className="bg-[#2A2A2A] w-fit px-4 py-2 rounded-lg text-sm font-bold">
                    Introduced in: {findSeasonByDate(product.firstReleaseDate)}
                  </p>
                  <p className="mt-2 bg-[#2A2A2A] w-fit px-4 py-2 rounded-lg text-sm font-bold">
                    Last seen: {product.previousReleaseDate}
                  </p>

                  {product.granted.length > 0 && (
                    <div className="mt-3 md:max-w-[500px]">
                      <h5 className=" font-semibold mb-1">
                        This buy includes:
                      </h5>
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.granted.map((item, index) => {
                          const iconUrl =
                            item.images.icon_background || item.images.icon;
                          if (!iconUrl) {
                            return null;
                          }

                          return (
                            <div
                              className="w-fit rounded-xl p-1 border-2 border-[#4A4A4A]"
                              key={index}
                            >
                              <div className="w-[70px] rounded-lg h-[70px] overflow-hidden">
                                <Image
                                  alt={item.name}
                                  width={500}
                                  height={500}
                                  layout="responsive"
                                  src={iconUrl} // Usa el icono disponible
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full max-md:mt-4">
                  <p className=" text-sm font-semibold">
                    Purchasable until{" "}
                    {new Date(product.offerDates.out).toLocaleString()} at your
                    local time
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleAddProduct}
                      className="mt-2 w-full bg-[#0088CC]/90 hover:bg-[#0088CC]/70 text-white"
                    >
                      Add to cart
                    </Button>
                    <Button
                      onClick={() => {
                        handleAddProduct();
                        router.push("/checkout");
                      }}
                      className="mt-2 w-full bg-transparent border-2 border-[#0088CC]/90 text-white hover:bg-[#0088CC]/90"
                    >
                      Buy now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ShopIdPage;
