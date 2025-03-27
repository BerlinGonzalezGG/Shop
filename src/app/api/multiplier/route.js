import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Multiplier from "@/lib/models/multiplier";
import { authenticate } from "@/middlewares/authenticate";

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
    const multipliers = await getMultiplier();
    return NextResponse.json(multipliers);
  } catch (error) {
    console.error("Error retrieving multipliers:", error);
    return NextResponse.json(
      { message: "Failed to retrieve multipliers" },
      { status: 500 }
    );
  }
}

export async function getMultiplier() {
  try {
    const multipliers = await Multiplier.find().lean(); // Uso de lean() para mejorar el rendimiento
    return multipliers;
  } catch (error) {
    console.error("Error retrieving multipliers:", error);
    throw new Error("Failed to get multipliers");
  }
}

export async function POST(request) {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const newMultiplier = new Multiplier(body);
    const savedMultiplier = await newMultiplier.save();
    return NextResponse.json(savedMultiplier);
  } catch (error) {
    console.error("Error saving multiplier:", error);
    return NextResponse.json(
      { message: "Failed to save multiplier" },
      { status: 500 }
    );
  }
}
