import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Coupon from "@/lib/models/coupon";

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
    // Buscar cupón por código
    const coupon = await Coupon.findOne({ code: params.id }).lean();

    if (!coupon) {
      return NextResponse.json({ msg: "invalid-coupon" }, { status: 404 });
    }

    const currentDate = new Date();
    const expiryDate = new Date(coupon.expires);

    // Verificar si el cupón ha expirado
    if (currentDate > expiryDate) {
      return NextResponse.json({ msg: "coupon-expired" }, { status: 410 });
    }

    // Verificar si el cupón ha sido utilizado
    if (coupon.uses <= 0) {
      return NextResponse.json({ msg: "coupon-uses-expired" }, { status: 410 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error retrieving coupon:", error);
    return NextResponse.json(
      { message: "Failed to retrieve coupon" },
      { status: 500 }
    );
  }
}
