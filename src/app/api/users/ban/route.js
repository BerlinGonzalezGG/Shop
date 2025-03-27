import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Ban from "@/lib/models/ban";
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
    const bans = await Ban.find().lean(); // Uso de lean() para mejorar el rendimiento
    return NextResponse.json(bans);
  } catch (error) {
    console.error("Error retrieving bans:", error);
    return NextResponse.json(
      { message: "Failed to retrieve bans" },
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
    const body = await request.json();
    const newBan = new Ban(body);
    const savedBan = await newBan.save();
    return NextResponse.json(savedBan);
  } catch (error) {
    console.error("Error saving ban:", error);
    return NextResponse.json(
      { message: "Failed to save ban" },
      { status: 500 }
    );
  }
}
