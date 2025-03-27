import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Client from "@/lib/models/client";
import { authenticate } from "@/middlewares/authenticate";

// Conexión a la base de datos
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export async function getToken(authDa){
  if(authDa.token){
    const now = new Date()
    const expires = new Date(authDa.token.expires)
    if (now.getTime() < expires.getTime()) {
      return authDa.token.code
    }
  }
  
  const data = new URLSearchParams({
    grant_type: "device_auth",
    account_id: authDa.accountId,
    device_id: authDa.deviceId,
    secret: authDa.secret,
  });

  const resToken = await fetch(
    "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic M2Y2OWU1NmM3NjQ5NDkyYzhjYzI5ZjFhZjA4YThhMTI6YjUxZWU5Y2IxMjIzNGY1MGE2OWVmYTY3ZWY1MzgxMmU=`,
      },
      body: data,
      cache: "no-store",
    }
  );

  if (!resToken.ok) throw new Error("Error al obtener el token.");
  const resTokenJson = await resToken.json();
  await Client.findByIdAndUpdate(
    authDa._id,
    { token: {
      expires: resTokenJson.expires_at,
      code: resTokenJson.access_token
    } },
    { new: true }
  );
  return resTokenJson.access_token
}

export async function POST(request) {
  // Autenticación del usuario
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  try {
    const codes = await Client.find();
    const { username } = await request.json();

    // Procesar cada cliente de forma concurrente
    await Promise.all(codes.map(async (authDa) => {
      try {
        const accessToken = await getToken(authDa)
        const resCreatorCodeSent = await fetch(
          `https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${authDa.accountId}/client/SetAffiliateName`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              affiliateName: username
            }),
          }
        );

        if (!resCreatorCodeSent.ok) {
          console.error(`Failed to set creator code for account ${authDa.accountId}: ${resCreatorCodeSent.statusText}`);
          throw new Error("Failed to set creator code");
        }
      } catch (error) {
        console.error(`Error processing account ${authDa.accountId}: ${error.message}`);
      }
    }));

    return NextResponse.json({ message: "All operations completed", status: 200 });

  } catch (error) {
    console.error("Error during operation:", error.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
