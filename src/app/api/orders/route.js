import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Order from "@/lib/models/order";
import { authenticate } from "@/middlewares/authenticate";
import { checkShop } from "../products/route";

export const dynamic = "force-dynamic";

// Conexión a la base de datos
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export async function GET() {
  checkShop();
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const orders = await Order.find().sort({ timestamp: -1 }).lean(); // Uso de sort() directamente en la consulta para mayor eficiencia
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return NextResponse.json(
      { message: "Failed to retrieve orders" },
      { status: 500 }
    );
  }
}

/*
// Descomentar si necesitas la función POST
export async function POST(request) {
  try {
    const body = await request.json();
    const newOrder = new Order(body);
    const savedOrder = await newOrder.save();
    return NextResponse.json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json(
      { message: "Failed to save order" },
      { status: 500 }
    );
  }
}
*/
