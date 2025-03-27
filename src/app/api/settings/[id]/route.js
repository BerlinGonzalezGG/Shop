import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Settings from "@/lib/models/settings";
import { authenticate } from "@/middlewares/authenticate";

export async function PUT(request, { params }) {
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await request.json();
    const settingsUpdated = await Settings.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true, lean: true } // Validar antes de actualizar y usar lean()
    );

    if (!settingsUpdated) {
      return NextResponse.json(
        { message: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(settingsUpdated);
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { message: "Failed to update setting" },
      { status: 500 }
    );
  }
}
