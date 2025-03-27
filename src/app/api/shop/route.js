import { NextResponse } from "next/server";
import { checkShop } from "../products/route";

export async function getShop() {
  try {
    const headers = { Authorization: process.env.FN_SHOP_AUTH };
    const response = await fetch("https://fortniteapi.io/v2/shop?lang=en", {
      headers,
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return { shop: data.shop }; // Devuelve solo los datos de la tienda
  } catch (error) {
    console.error("Error fetching shop data:", error); // Registro del error en consola
    throw error; // Lanza el error para que pueda ser manejado en la función GET
  }
}

export async function GET() {
  checkShop();
  try {
    const { shop } = await getShop(); // Extrae la tienda de la función getShop
    const res = NextResponse.json({ shop });

    // Configura los headers para evitar caching
    res.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    res.headers.set("Surrogate-Control", "no-store");

    return res;
  } catch (error) {
    console.error("Error in GET request:", error); // Registro del error en consola
    // Maneja los errores y configura el estado HTTP según el error
    return NextResponse.json(
      { message: "Failed to fetch shop data" },
      { status: error.message === "Unauthorized" ? 401 : 500 } // Ajusta el estado HTTP
    );
  }
}
