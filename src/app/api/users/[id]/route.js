import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import User from "@/lib/models/user";
import { authenticate } from "@/middlewares/authenticate";

// Conexión a la base de datos
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export async function GET(request, { params }) {
  try {
    const user = await User.findById(params.id).lean(); // Uso de lean() para mejorar el rendimiento
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { message: "Failed to retrieve user" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const userUpdated = await User.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true, lean: true } // Validar antes de actualizar y usar lean()
    );

    if (!userUpdated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userUpdated);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  try {
    const removedUser = await User.findByIdAndDelete(params.id).lean();
    if (!removedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(removedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
