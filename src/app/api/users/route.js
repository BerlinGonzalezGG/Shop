import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import User from "@/lib/models/user";
import { authenticate } from "@/middlewares/authenticate";

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
  try {
    const users = await User.find().lean(); // Uso de lean() para mejorar el rendimiento
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { message: "Failed to retrieve users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await request.json();
    const newUser = new User(body);
    const savedUser = await newUser.save();
    return NextResponse.json(savedUser);
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { message: "Failed to save user" },
      { status: 500 }
    );
  }
}
