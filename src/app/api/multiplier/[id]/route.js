import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Multiplier from "@/lib/models/multiplier";
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
    const multiplier = await Multiplier.findById(params.id).lean();
    if (!multiplier) {
      return NextResponse.json(
        { message: "Multiplier not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(multiplier);
  } catch (error) {
    console.error("Error retrieving multiplier:", error);
    return NextResponse.json(
      { message: "Failed to retrieve multiplier" },
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

    const multiplierUpdated = await Multiplier.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true, lean: true }
    );

    if (!multiplierUpdated) {
      return NextResponse.json(
        { message: "Multiplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(multiplierUpdated);
  } catch (error) {
    console.error("Error updating multiplier:", error);
    return NextResponse.json(
      { message: "Failed to update multiplier" },
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
    const removedMultiplier = await Multiplier.findByIdAndDelete(params.id).lean();

    if (!removedMultiplier) {
      return NextResponse.json(
        { message: "Multiplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(removedMultiplier);
  } catch (error) {
    console.error("Error deleting multiplier:", error);
    return NextResponse.json(
      { message: "Failed to delete multiplier" },
      { status: 500 }
    );
  }
}
