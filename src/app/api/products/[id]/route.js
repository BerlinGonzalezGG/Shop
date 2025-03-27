import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Product from "@/lib/models/product";
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
    const product = await Product.findById(params.id).lean(); // Uso de lean() para mejorar el rendimiento
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    return NextResponse.json(
      { message: "Failed to retrieve product" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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
    const productUpdated = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true, lean: true } // Validar antes de actualizar y usar lean()
    );

    if (!productUpdated) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(productUpdated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const removedProduct = await Product.findByIdAndDelete(params.id).lean();
    if (!removedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(removedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
