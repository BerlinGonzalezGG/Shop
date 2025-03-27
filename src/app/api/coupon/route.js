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

export async function GET() {
  try {
    const authResult = await authenticate();
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }
    
    const coupons = await getCoupons();
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error retrieving coupons:", error);
    return NextResponse.json(
      { message: "Failed to retrieve coupons" },
      { status: 500 }
    );
  }
}

export async function getCoupons() {
  try {
    const coupons = await Coupon.find().lean();
    return coupons;
  } catch (error) {
    console.error("Error retrieving coupons from database:", error);
    throw new Error("Failed to fetch coupons");
  }
}

export async function POST(request) {
  try {
    const authResult = await authenticate();
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const newCoupon = new Coupon(body);
    const savedCoupon = await newCoupon.save();
    return NextResponse.json(savedCoupon);
  } catch (error) {
    console.error("Error creating new coupon:", error);
    return NextResponse.json(
      { message: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
