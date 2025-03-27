import BreadCrumb from "@/components/dashboard/breadcrumb";
import AsideBar from "./(components)/aside-bar";
import SearchableShop from "./(components)/searcheable-shop";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default async function ShopPage() {
  let shop = [];
  let fnProducts = [];
  let multiplier = null;

  try {
    const [shopResponse, resMultiplier, resProducts] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/shop`, {
        cache: "no-store",
        headers: {
          "x-client-token": process.env.NEXT_PUBLIC_CLIENT_TOKEN,
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/multiplier`, {
        method: "GET",
      }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`, {
        method: "GET",
      }),
    ]);
    const shopData = await shopResponse.json();
    shop = shopData.shop || [];

    const multiplierData = await resMultiplier.json();
    multiplier = multiplierData[0];

    const productsData = await resProducts.json();
    fnProducts =
      productsData.filter(
        (e) => e.category != "download" && e.status == true
      ) || [];
  } catch (error) {
    console.log("error catch: ", error);
  }

  // Agrupar productos y separar "Take your stage"
  const groupedProducts = {};
  let takeYourStageProducts = {};
  let startYourEnginesProducts = {};

  shop.forEach((product) => {
    const { category, name } = product.section;
    if (category === "Take Your Stage") {
      if (!takeYourStageProducts[name]) takeYourStageProducts[name] = [];
      takeYourStageProducts[name].push(product);
    } else if (category === "Start Your Engines") {
      if (!startYourEnginesProducts[name]) startYourEnginesProducts[name] = [];
      startYourEnginesProducts[name].push(product);
    } else {
      if (!groupedProducts[category]) groupedProducts[category] = {};
      if (!groupedProducts[category][name])
        groupedProducts[category][name] = [];
      groupedProducts[category][name].push(product);
    }
  });

  // Filtrar subcategorías vacías y agregar "Take your stage" al final
  const filteredGrouped = {};
  Object.entries(groupedProducts).forEach(([category, subcategories]) => {
    const nonEmptySubcategories = Object.entries(subcategories).reduce(
      (acc, [subcategory, products]) => {
        if (products.length > 0) {
          acc[subcategory] = products;
        }
        return acc;
      },
      {}
    );

    if (Object.keys(nonEmptySubcategories).length > 0) {
      filteredGrouped[category] = nonEmptySubcategories;
    }
  });

  if (Object.keys(takeYourStageProducts).length > 0) {
    filteredGrouped["Take your stage"] = takeYourStageProducts;
  }

  if (Object.keys(startYourEnginesProducts).length > 0) {
    filteredGrouped["Start Your Engines"] = startYourEnginesProducts;
  }

  const breadcrumbItems = [{ title: "Fortnite shop", link: `/shop` }];

  return (
    <div className="flex flex-col min-h-screen text-gray-50">
      <Navbar />
      <main className="flex-1 w-full container flex flex-col items-start">
        <div className="md:ml-12 max-md:mb-4 mt-[125px]">
          <BreadCrumb items={breadcrumbItems} />
          <h3 className="font-extrabold italic text-5xl">SHOP</h3>
          <p>powered by BerlinGonzalez</p>
          <p>
            Buy Cheap Fortnite Skins - Immediate delivery to your personal
            Fortnite account
          </p>
        </div>

        <div className="flex gap-2 md:relative md:flex-row flex-col md:gap-4">
          {Object.keys(filteredGrouped).length > 0 && (
            <AsideBar filteredGrouped={filteredGrouped} />
          )}

          <div className="flex max-md:mt-10 md:ml-12 flex-col w-fit">
            <SearchableShop
              groupedProducts={filteredGrouped}
              fnProducts={fnProducts}
              multiplier={multiplier}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
