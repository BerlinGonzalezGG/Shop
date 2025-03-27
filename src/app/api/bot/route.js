import { NextResponse } from "next/server";
import Client from "@/lib/models/client";
import { connectDB } from "@/lib/mongo";
import Joi from "joi";

const sendDiscordMessage = (user, bot) => {
  setTimeout(async () => {
    const res = await fetch(process.env.FRIENDS_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `Ya pasaron 2 dias desde que ${user} agregó a ${bot}`
      })
    });
  }, 48.5 * 60 * 60 * 1000);
}

export async function POST(request) {
  const schema = Joi.object({
    username: Joi.string().required()
  });

  const { error, value } = schema.validate(await request.json());

  if (error) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { username } = value;
  const addedBots = await sendFriendRequest(username);
  return NextResponse.json(addedBots);
}

export async function GET() {
  const added = await acceptFriendRequests();
  return NextResponse.json(added);
}

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

export async function acceptFriendRequests() {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
    return { error: "Database connection failed." };
  }
  const clients = await Client.find({});
  const results = await Promise.all(
    clients.map(async client => {
      try {
        const accessToken = await getToken(client)

        // Obtener amigos entrantes
        const friendsResponse = await fetch(
          `https://friends-public-service-prod.ol.epicgames.com/friends/api/v1/${client.accountId}/incoming`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        if (!friendsResponse.ok) {
          console.error(`Error fetching incoming friends for client ${client.accountId}:`, friendsResponse.statusText);
          throw new Error("Error fetching incoming friends.");
        }
        const incomingFriends = await friendsResponse.json();

        // Aceptar solicitudes de amistad
        if (incomingFriends.length > 0) {
          const targetIds = incomingFriends.map(e => e.accountId).join(",");

          const acceptResponse = await fetch(
            `https://friends-public-service-prod.ol.epicgames.com/friends/api/v1/${client.accountId}/incoming/accept?targetIds=${targetIds}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
              }
            }
          );

          if (!acceptResponse.ok) {
            console.error(`Error accepting friends for client ${client.accountId}:`, acceptResponse.statusText);
            throw new Error(
              `Error accepting friends for client ${client.accountId}.`
            );
          }

          return await acceptResponse.json();
        } else {
          return {
            message: `No incoming friends for client ${client.accountId}.`
          };
        }
      } catch (error) {
        console.error(`Error processing client ${client.accountId}:`, error.message);
        return { error: error.message, client: client.accountId };
      }
    })
  );

  return results;
}

async function sendFriendRequest(username) {
  const addedBots = [];
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
    return addedBots; // Or handle the error appropriately
  }
  const clients = await Client.find({});

  const requests = clients.map(async client => {
    try {
      const accessToken = await getToken(client)

      const resUserId = await fetch(
        `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/displayName/${username}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!resUserId.ok) {
        return;
      }

      const resUserIdJson = await resUserId.json();

      const resFriendAdded = await fetch(
        `https://friends-public-service-prod.ol.epicgames.com/friends/api/v1/${client.accountId}/friends/${resUserIdJson.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      if (resFriendAdded.ok) {
        addedBots.push(client.accountId);
        sendDiscordMessage(username, client.name)
      } else if (resFriendAdded.status === 409) {
      } else {
      }
    } catch (error) {
      console.error("Error in fetch process:", error.message);
    }
  });

  await Promise.all(requests);
  return addedBots;
}
