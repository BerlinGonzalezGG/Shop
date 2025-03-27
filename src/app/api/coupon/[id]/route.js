import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Coupon from "@/lib/models/coupon";
import { authenticate, authorize } from "@/middlewares/authenticate";

(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export async function GET(request, { params }) {
  try {
    const coupon = await Coupon.findById(params.id).lean();
    if (!coupon) {
      return NextResponse.json({ msg: "invalid-coupon" }, { status: 404 });
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

export async function PUT(request, { params }) {
  try {
    const authResult = await authenticate();
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();

    const couponUpdated = await Coupon.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true, lean: true }
    );

    if (!couponUpdated) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(couponUpdated);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { message: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticate();
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const removedCoupon = await Coupon.findByIdAndDelete(params.id).lean();

    if (!removedCoupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(removedCoupon);
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { message: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
