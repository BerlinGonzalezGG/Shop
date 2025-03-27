import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { authenticate } from "@/middlewares/authenticate";

// Conexión a la base de datos
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export async function POST(request) {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  try {
    const { username, authorizationCode } = await request.json();

    // Solicitar el token
    const tokenResponse = await fetch(
      "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic M2Y2OWU1NmM3NjQ5NDkyYzhjYzI5ZjFhZjA4YThhMTI6YjUxZWU5Y2IxMjIzNGY1MGE2OWVmYTY3ZWY1MzgxMmU=`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: authorizationCode
        }),
        redirect: "follow"
      }
    );

    if (!tokenResponse.ok) {
      console.error("Failed to retrieve token:", tokenResponse.statusText);
      return NextResponse.json(
        { message: "Failed to retrieve token" },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    // Enviar el código de creador
    const resCreatorCodeSent = await fetch(
      `https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${tokenData.account_id}/client/SetAffiliateName`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify({
          affiliateName: username
        }),
      }
    );

    if (!resCreatorCodeSent.ok) {
      console.error("Failed to set creator code:", resCreatorCodeSent.statusText);
      return NextResponse.json(
        { message: "Failed to set creator code" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Creator code set successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
