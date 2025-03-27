import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import mongoose from "mongoose";
import Order from "@/lib/models/order";
import { authenticate } from "@/middlewares/authenticate";

// Conexión a la base de datos
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

async function getUsers() {
  try {
    const usersCollection = mongoose.connection.collection("users");
    const users = await usersCollection.find({}).toArray();
    return users;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw new Error("Failed to get users");
  }
}

export async function GET() {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  try {
    const [orders, users] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).lean(),
      getUsers()
    ]);

    return NextResponse.json({ orders, users });
  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json(
      { message: "Failed to retrieve data" },
      { status: 500 }
    );
  }
}
