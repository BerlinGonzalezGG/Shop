"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import SkinProduct from "@/components/products/skin-product";
import FortniteProduct from "./fn-product";

export default function SearchableShop({
  groupedProducts,
  fnProducts,
  multiplier,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Función para filtrar productos en base a la búsqueda (se puede ajustar según los campos disponibles)
  const filterProducts = (products) => {
    if (!searchQuery) return products;
    console.log(products);
    return products.filter(
      (product) =>
        product.displayName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.section?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Filtrar productos por categoría y subcategoría
  const filteredGroupedProducts = {};
  for (const [category, subcategories] of Object.entries(groupedProducts)) {
    const filteredSub = {};
    for (const [subcategory, products] of Object.entries(subcategories)) {
      const filtered = filterProducts(products);
      if (filtered.length > 0) {
        filteredSub[subcategory] = filtered;
      }
    }
    if (Object.keys(filteredSub).length > 0) {
      filteredGroupedProducts[category] = filteredSub;
    }
  }

  // Filtrar productos de Fortnite (vbucks)
  const filteredFnProducts = filterProducts(fnProducts);

  return (
    <div>
      <Input
        type="text"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 w-[300px] mt-4"
      />

      {filteredFnProducts.filter((e) => e.category == "pack").length > 0 && (
        <div className="h-auto w-auto py-4 scroll-mt-24" id="pack">
          <h4 className="font-black italic text-4xl">PACKS</h4>
          <div className="flex items-center max-xs:justify-center flex-wrap gap-2 mt-4">
            {filteredFnProducts
              .filter((e) => e.category == "pack")
              .map((product, index) => (
                <FortniteProduct key={index} product={product} />
              ))}
          </div>
        </div>
      )}

      {Object.entries(filteredGroupedProducts).map(
        ([category, subcategories]) => {
          // Filtra las subcategorías: en cada una, dejamos solo los productos que no sean "Music"
          const validSubcategories = Object.entries(subcategories)
            .map(([subcategory, products]) => {
              const validProducts = products.filter(
                (product) => product.displayType !== "Music"
              );
              return validProducts.length > 0
                ? { subcategory, validProducts }
                : null;
            })
            .filter((item) => item !== null);

          // Si ninguna subcategoría tiene productos válidos, no se renderiza la categoría
          if (validSubcategories.length === 0) {
            return null;
          }

          return validSubcategories.map(({ subcategory, validProducts }) => (
            <div
              key={subcategory}
              className="h-auto w-auto py-4 scroll-mt-24"
              id={subcategory}
            >
              <h4 className="font-black italic text-4xl">
                {subcategory.toUpperCase()}
              </h4>
              <div className="flex items-center max-xs:justify-center flex-wrap gap-2 mt-4">
                {multiplier &&
                  validProducts.map(
                    (product) =>
                      product.price.finalPrice !== 0 && (
                        <SkinProduct
                          key={product.offerId}
                          product={product}
                          multiplier={multiplier}
                        />
                      )
                  )}
              </div>
            </div>
          ));
        }
      )}

      {filteredFnProducts.filter((e) => e.category == "club").length > 0 && (
        <div className="h-auto w-auto py-4 scroll-mt-24" id="crew">
          <h4 className="font-black italic text-4xl">CREW</h4>
          <div className="flex items-center max-xs:justify-center flex-wrap gap-2 mt-4">
            {filteredFnProducts
              .filter((e) => e.category == "club")
              .map((product, index) => (
                <FortniteProduct key={index} product={product} />
              ))}
          </div>
        </div>
      )}

      {filteredFnProducts.filter((e) => e.category == "battlepass").length >
        0 && (
        <div className="h-auto w-auto py-4 scroll-mt-24" id="battlepass">
          <h4 className="font-black italic text-4xl">BATTLEPASS</h4>
          <div className="flex items-center max-xs:justify-center flex-wrap gap-2 mt-4">
            {filteredFnProducts
              .filter((e) => e.category == "battlepass")
              .map((product, index) => (
                <FortniteProduct key={index} product={product} />
              ))}
          </div>
        </div>
      )}

      {filteredFnProducts.filter((e) => e.category == "vbucks").length > 0 && (
        <div className="h-auto w-auto py-4 scroll-mt-24" id="vbucks">
          <h4 className="font-black italic text-4xl">VBUCKS</h4>
          <div className="flex items-center max-xs:justify-center flex-wrap gap-2 mt-4">
            {filteredFnProducts
              .filter((e) => e.category == "vbucks")
              .map((product, index) => (
                <FortniteProduct key={index} product={product} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
