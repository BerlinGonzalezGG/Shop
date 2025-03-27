import { NextResponse } from "next/server";
import Client from "@/lib/models/client";
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

    const codes = await Client.find();
    
    const { authorizationCode } = await request.json();

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

    // Solicitar autenticación de dispositivo
    const deviceAuthResponse = await fetch(
      `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${tokenData.account_id}/deviceAuth`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        },
        redirect: "follow"
      }
    );

    if (!deviceAuthResponse.ok) {
      console.error("Failed to retrieve device auth:", deviceAuthResponse.statusText);
      return NextResponse.json(
        { message: "Failed to retrieve device auth" },
        { status: 400 }
      );
    }

    const deviceAuthData = await deviceAuthResponse.json();

    const response = {
      deviceId: deviceAuthData.deviceId,
      accountId: deviceAuthData.accountId,
      secret: deviceAuthData.secret,
      name: tokenData.displayName
    };

    // Verificar si el usuario ya está registrado
    const existingClient = await Client.findOne({
      accountId: response.accountId
    });
    if (existingClient) {
      return NextResponse.json(
        { message: "Account already registered" },
        { status: 409 }
      );
    }

    // Guardar la respuesta en la base de datos
    const newClient = new Client(response);
    await newClient.save();

    return NextResponse.json({ message: "Account saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
