import Script from "next/script";
import Product from "@/lib/models/product";
import { connectDB } from "@/lib/mongo";
const Schemas = async () => {
  try {
    await connectDB();
    const products = await Product.find();

    return (
      <Script
        id="json-ld-product"
        type="application/ld+json "
        strategy="afterInteractive"
      >
        {`
              {
                "@context": "https://schema.org/",
                "@graph": [
                  ${products
                    .map(
                      (product) => `
                      {
                        "@type": "Product",
                        "name": "${product.name}",
                        "image": "${product.imageUrl}",
                        "description": "${product.description}",
                        "brand": {
                          "@type": "Thing",
                          "name": "Fortnite"
                        },
                        "offers": {
                          "@type": "Offer",
                          "priceCurrency": "USD",
                          "price": "${product.price}",
                          "itemCondition": "https://schema.org/NewCondition",
                          "availability": "https://schema.org/InStock",
                          "url": ${process.env.NEXT_PUBLIC_APP_URL}
                        }
                      }`
                    )
                    .join(",")}
                ]
              }
            `}
      </Script>
    );
  } catch (error) {
    return null;
  }
};

export default Schemas;
