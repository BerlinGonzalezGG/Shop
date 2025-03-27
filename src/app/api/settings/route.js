import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Settings from "@/lib/models/settings";
import { authenticate } from "@/middlewares/authenticate";

export const dynamic = "force-dynamic";

(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export async function CloseOpenShop(state) {
  console.log("CAMBIANDO STATE AHORA: ", state);
  const settingsUpdated = await Settings.findByIdAndUpdate(
    "6725cf1a4fac20aa985e9fd4",
    { order: state },
    { new: true, runValidators: true, lean: true } // Validar antes de actualizar y usar lean()
  );
}

export async function GET() {
  try {
    const settings = await Settings.find().lean();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to retrieve settings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await request.json();
    const newSettings = new Settings(body);
    const savedSettings = await newSettings.save();
    return NextResponse.json(savedSettings);
  } catch (error) {
    console.error("Error saving setting:", error);
    return NextResponse.json(
      { message: "Failed to save setting" },
      { status: 500 }
    );
  }
}
