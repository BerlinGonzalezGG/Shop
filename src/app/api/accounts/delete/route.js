import { NextResponse } from "next/server";
import Client from "@/lib/models/client";
import { connectDB } from "@/lib/mongo";
import Joi from "joi";

export async function POST(request) {
  const schema = Joi.object({
    username: Joi.string().required(),
  });

  const { error, value } = schema.validate(await request.json());

  if (error) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { username } = value;
  const addedBots = await deleteUser(username);
  return NextResponse.json(addedBots);
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

async function deleteUser(username) {
  const addedBots = [];
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
    return addedBots; // Or handle the error appropriately
  }
  const clients = await Client.find({});

  const requests = clients.map(async (client) => {
    try {
      const accessToken = await getToken(client);

      const resUserId = await fetch(
        `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/displayName/${username}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!resUserId.ok) {
        return;
      }

      const resUserIdJson = await resUserId.json();

      const resFriendDeleted = await fetch(
        `https://friends-public-service-prod.ol.epicgames.com/friends/api/v1/${client.accountId}/friends/${resUserIdJson.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (resFriendDeleted.ok) {
        addedBots.push(client.accountId);
      } else if (resFriendDeleted.status === 409) {
      } else {
      }
    } catch (error) {
      console.error("Error in fetch process:", error.message);
    }
  });

  await Promise.all(requests);
  return addedBots;
}
