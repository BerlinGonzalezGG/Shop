import React from "react";
import ProductContainer from "../products/product-container";
import { getProducts } from "@/app/api/products/route";

const ChargesSection = async () => {
  try {
    // Obtén los productos directamente en el servidor
    const products = await getProducts();

    // Filtra los productos con status "true"
    const activeProducts = products.filter((e) => e.status === true);

    // Si hay productos activos, muestra el contenedor de productos
    if (activeProducts.length > 0) {
      return (
        <section
          id="charges"
          className="w-full min-h-screen pt-10 flex flex-col justify-center mb-10"
        >
          <ProductContainer />{" "}
          {/* Pasa los productos activos a ProductContainer */}
        </section>
      );
    } else {
      return <></>; // Si no hay productos activos, no muestra nada
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return <></>; // Si ocurre un error, no muestra nada
  }
};

export default ChargesSection;
