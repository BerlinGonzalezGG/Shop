import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { authenticate } from "@/middlewares/authenticate";
import Currency from "@/lib/models/currency";

// Conexión a la base de datos
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export async function GET() {
  try {
    const currency = await Currency.find().lean();
    return NextResponse.json(currency);
  } catch (error) {
    console.error("Error retrieving currencies:", error);
    return NextResponse.json(
      { message: "Failed to retrieve currencies" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }
  
  try {
    const data = await request.json();
    const newCurrency = new Currency(data);
    const savedCurrency = await newCurrency.save();

    return NextResponse.json(savedCurrency);
  } catch (error) {
    console.error("Error saving currency:", error);
    return NextResponse.json(
      { message: "Failed to save currency" },
      { status: 500 }
    );
  }
}
