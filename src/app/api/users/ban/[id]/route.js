import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Ban from "@/lib/models/ban";
import { authenticate } from "@/middlewares/authenticate";

// Conexión a la base de datos
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();


export async function DELETE(request, { params }) {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  try {
    const removedBan = await Ban.findByIdAndDelete(params.id).lean();
    if (!removedBan) {
      return NextResponse.json({ message: "Ban not found" }, { status: 404 });
    }
    return NextResponse.json(removedBan);
  } catch (error) {
    console.error("Error deleting ban:", error);
    return NextResponse.json(
      { message: "Failed to delete ban" },
      { status: 500 }
    );
  }
}
