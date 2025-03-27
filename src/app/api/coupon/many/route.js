import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Coupon from "@/lib/models/coupon";
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
    const body = await request.json();

    // Verificar el formato de la solicitud
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: "Invalid request format" }, { status: 400 });
    }

    // Eliminar órdenes
    const result = await Coupon.deleteMany({ _id: { $in: body } });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "No coupons found to delete" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting coupons:", error);
    return NextResponse.json(
      { message: "Failed to delete coupons" },
      { status: 500 } // Usa 500 para errores del servidor
    );
  }
}
