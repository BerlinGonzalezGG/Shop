import { NextResponse } from "next/server";
import Client from "@/lib/models/client";
import { connectDB } from "@/lib/mongo";
import { authenticate } from "@/middlewares/authenticate";

// Conexión a la base de datos
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export async function DELETE(request) {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  try {
    const { accountId } = await request.json();

    // Validar el ID de la cuenta
    if (!accountId) {
      return NextResponse.json(
        { message: "Account ID is required" },
        { status: 400 }
      );
    }

    // Intentar eliminar el cliente de la base de datos
    const result = await Client.deleteOne({ accountId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Account ID not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
