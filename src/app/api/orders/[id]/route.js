import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
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

export async function GET(request, { params }) {
  try {
    const order = await Order.findById(params.id).lean(); // Uso de lean() para mejorar el rendimiento
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error retrieving order:", error);
    return NextResponse.json(
      { message: "Failed to retrieve order" },
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
    const data = await request.json();
    const orderUpdated = await Order.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true, lean: true } // Validar antes de actualizar y usar lean()
    );

    if (!orderUpdated) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(orderUpdated);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update order" },
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
    const orderDeleted = await Order.findByIdAndDelete(params.id).lean();
    if (!orderDeleted) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(orderDeleted);
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 500 }
    );
  }
}
