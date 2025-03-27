import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Product from "@/lib/models/product";
import { authenticate } from "@/middlewares/authenticate";
import Settings from "@/lib/models/settings";
import { CloseOpenShop } from "../settings/route";

export const dynamic = "force-dynamic";

// Conexión a la base de datos
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export async function checkShop() {
  // Obtener la hora en Buenos Aires sin depender de la zona horaria del servidor
  const ahora = new Date();
  const opciones = {
    timeZone: "America/Argentina/Buenos_Aires",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  };
  const horaActualStr = new Intl.DateTimeFormat("es-AR", opciones).format(
    ahora
  ); // "HH:mm"

  // Convertir "HH:mm" a minutos desde medianoche para comparaciones precisas
  const [hora, minuto] = horaActualStr.split(":").map(Number);
  const minutosActuales = hora * 60 + minuto; // Convierte "HH:mm" a minutos totales

  // Horarios de activación/desactivación convertidos a minutos desde medianoche
  const minutosDesactivacion = 20 * 60 + 55; // 20:55 → 1255 min
  const minutosActivacion = 21 * 60 + 30; // 21:30 → 1290 min

  // Obtener configuración de la base de datos
  const settings = await Settings.findOne({});
  if (!settings) return;
  const orderStatus = settings.order;

  // Condición para desactivar la tienda (de 20:55 a 21:30)
  if (
    minutosActuales >= minutosDesactivacion &&
    minutosActuales < minutosActivacion
  ) {
    if (orderStatus) {
      await CloseOpenShop(false); // Cierra la tienda
    }
  } else {
    if (!orderStatus) {
      await CloseOpenShop(true); // Abre la tienda
    }
  }
}

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return NextResponse.json(
      { message: "Failed to retrieve products" },
      { status: 500 }
    );
  }
}

export async function getProducts() {
  try {
    await connectDB();
    const products = await Product.find().lean(); // Uso de lean() para mejorar el rendimiento
    return products;
  } catch (error) {
    console.error("Error retrieving products:", error);
    throw new Error("Failed to get products");
  }
}

export async function POST(request) {
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await request.json();
    const newProduct = new Product(body);
    const savedProduct = await newProduct.save();
    return NextResponse.json(savedProduct);
  } catch (error) {
    console.error("Error saving product:", error);
    return NextResponse.json(
      { message: "Failed to save product" },
      { status: 500 }
    );
  }
}
