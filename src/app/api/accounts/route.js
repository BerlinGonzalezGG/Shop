import { NextResponse } from "next/server";
import Client from "@/lib/models/client";
import { authenticate } from "@/middlewares/authenticate";
import { connectDB } from "@/lib/mongo";

// Conexión a la base de datos
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export async function GET() {
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const accountsResult = await getAccounts();
    return NextResponse.json(accountsResult);
  } catch (error) {
    console.error("Error retrieving accounts:", error.message);
    return NextResponse.json(
      { message: "Failed to retrieve accounts" },
      { status: 500 }
    );
  }
}

export async function getToken(authDa) {
  if (authDa.token) {
    const now = new Date();
    const expires = new Date(authDa.token.expires);
    if (now.getTime() < expires.getTime()) {
      return authDa.token.code;
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
    {
      token: {
        expires: resTokenJson.expires_at,
        code: resTokenJson.access_token,
      },
    },
    { new: true }
  );
  return resTokenJson.access_token;
}

export async function getAccounts() {
  const successAccounts = [];
  const errorAccounts = [];
  const codes = await Client.find();

  const fetchDataForAccount = async (authDa) => {
    try {
      const accessToken = await getToken(authDa);

      const resEmail = await fetch(
        `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${authDa.accountId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!resEmail.ok) throw new Error("Error al obtener el email");
      const resEmailJson = await resEmail.json();
      authDa.email = resEmailJson.email;

      const resFriends = await fetch(
        `https://friends-public-service-prod.ol.epicgames.com/friends/api/v1/${authDa.accountId}/summary`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!resFriends.ok) throw new Error("Error al obtener los amigos");
      const resFriendsJson = await resFriends.json();

      const resAccounts = await fetch(
        `https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${authDa.accountId}/client/QueryProfile?profileId=common_core`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
          redirect: "follow",
        }
      );

      if (!resAccounts.ok) throw new Error("Error al obtener la cuenta.");
      const resAccountsJson = await resAccounts.json();
      let bucks = 0;
      const profile = resAccountsJson.profileChanges[0].profile;
      const currencyItems = Object.values(profile.items).filter((item) =>
        item.templateId.toLowerCase().includes("currency")
      );
      bucks = currencyItems.reduce((total, item) => total + item.quantity, 0);
      let sent = profile.stats.attributes.gift_history?.gifts || [];

      let gifts = 5;
      if (sent.length > 0) {
        let i = sent
          .flatMap((x) => x.date)
          .filter((x) => Date.now() - Date.parse(x) < 8.64e7)
          .sort((a, b) => Date.parse(a) - Date.parse(b));
        gifts = 5 - i.length;
      }

      return {
        bucks,
        bot: authDa.name,
        botId: authDa.accountId,
        gifts,
        friends: resFriendsJson.friends,
        email: authDa.email,
      };
    } catch (error) {
      console.error(
        `Error en el proceso de fetch para la cuenta ${authDa.name}:`,
        error.message
      );
      return { error: true, bot: authDa.name, id: authDa.accountId };
    }
  };

  const results = await Promise.all(codes.map(fetchDataForAccount));

  results.forEach((result) => {
    if (result.error) {
      errorAccounts.push(result);
    } else {
      successAccounts.push(result);
    }
  });
  successAccounts.sort(
    (a, b) =>
      a.bot.match(/\d+/)[0] - b.bot.match(/\d+/)[0] ||
      a.bot.localeCompare(b.bot)
  );

  return { successAccounts, errorAccounts };
}
