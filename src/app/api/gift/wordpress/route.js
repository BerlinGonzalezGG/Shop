import { NextResponse } from "next/server";
import Client from "@/lib/models/client";
import { connectDB } from "@/lib/mongo";
import { getShop } from "../../shop/route";

(async () => {
  try {
    await connectDB();
  } catch (e) {
    console.error("Database connection error:", e);
  }
})();

const _s = async (_b, _o, _v, _u) => {
  const _s1 = await getShop();
  const _p = _s1.shop.find((_e) => _e.offerId == _o);
  const _m = `El bot ${_b} envio ${_p.displayName} por un precio de ***${_v}** pavos* a: ${_u}`;
  await fetch(process.env.GIFTS_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: _m }),
  });
};

export async function getToken(_a) {
  if (_a.token) {
    const _n = new Date();
    const _x = new Date(_a.token.expires);
    if (_n.getTime() < _x.getTime()) return _a.token.code;
  }
  const _d = new URLSearchParams({
    grant_type: "device_auth",
    account_id: _a.accountId,
    device_id: _a.deviceId,
    secret: _a.secret,
  });
  const _r = await fetch(
    "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic M2Y2OWU1NmM3NjQ5NDkyYzhjYzI5ZjFhZjA4YThhMTI6YjUxZWU5Y2IxMjIzNGY1MGE2OWVmYTY3ZWY1MzgxMmU=`,
      },
      body: _d,
      cache: "no-store",
    }
  );
  if (!_r.ok) throw new Error("Error al obtener el token.");
  const _j = await _r.json();
  await Client.findByIdAndUpdate(
    _a._id,
    { token: { expires: _j.expires_at, code: _j.access_token } },
    { new: true }
  );
  return _j.access_token;
}

export async function POST(_req) {
  try {
    const { offerId: _o, price: _p, receiverId: _u, wpToken } = await _req.json();
    
    // Verificar token WordPress
    if (wpToken !== process.env.WORDPRESS_API_TOKEN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const _sg = await sendGift(_o, _p, _u);
    return NextResponse.json(_sg, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (_e) {
    console.error("Error processing request:", _e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// ... resto del código sendGift igual al archivo original
