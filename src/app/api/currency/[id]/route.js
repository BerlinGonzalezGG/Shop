import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { authenticate } from "@/middlewares/authenticate";
import Currency from "@/lib/models/currency";

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
    const currency = await Currency.findById(params.id).lean();
    if (!currency) {
      return NextResponse.json(
        { message: "Currency not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(currency);
  } catch (error) {
    console.error("Error retrieving currency:", error);
    return NextResponse.json(
      { message: "Failed to retrieve currency" },
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
    const currencyUpdated = await Currency.findByIdAndUpdate(
      params.id,
      data,
      {
        new: true,
        runValidators: true,
        lean: true
      }
    );

    if (!currencyUpdated) {
      return NextResponse.json(
        { message: "Currency not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(currencyUpdated);
  } catch (error) {
    console.error("Error updating currency:", error);
    return NextResponse.json(
      { message: "Failed to update currency" },
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
    const currencyDeleted = await Currency.findByIdAndDelete(params.id).lean();
    if (!currencyDeleted) {
      return NextResponse.json(
        { message: "Currency not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(currencyDeleted);
  } catch (error) {
    console.error("Error deleting currency:", error);
    return NextResponse.json(
      { message: "Failed to delete currency" },
      { status: 500 }
    );
  }
}
