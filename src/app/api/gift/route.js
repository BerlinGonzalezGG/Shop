import { NextResponse } from "next/server";
import { authenticate } from "@/middlewares/authenticate";
import Client from "@/lib/models/client";
import { connectDB } from "@/lib/mongo";
import { getShop } from "../shop/route";

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
  const _ar = await authenticate();
  if (_ar.error)
    return NextResponse.json({ message: _ar.error }, { status: _ar.status });
  try {
    const { offerId: _o, price: _p, receiverId: _u } = await _req.json();
    const _sg = await sendGift(_o, _p, _u);
    return NextResponse.json(_sg);
  } catch (_e) {
    console.error("Error processing request:", _e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const sendGift = async (_o, _p, _u, _a = 0) => {
  const _m = 3;
  const _eb = [];
  const _cs = await Client.find({});
  _cs.sort(
    (_x, _y) =>
      _x.name.match(/\d+/)[0] - _y.name.match(/\d+/)[0] ||
      _x.name.localeCompare(_y.name)
  );
  for (const _c of _cs) {
    try {
      const _at = await getToken(_c);
      const _rr = await fetch(
        `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/displayName/${_u}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${_at}` },
        }
      );
      if (!_rr.ok) return { message: "username-error" };
      const _rj = await _rr.json();
      const _bd = {
        offerId: _o,
        currency: "MtxCurrency",
        currencySubType: "",
        expectedTotalPrice: _p,
        gameContext: "Frontend.CatabaScreen",
        receiverAccountIds: [_rj.id],
        giftWrapTemplateId: "",
        personalMessage: "",
      };
      const _rg = await fetch(
        `https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${_c.accountId}/client/GiftCatalogEntry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_at}`,
          },
          body: JSON.stringify(_bd),
        }
      );
      const _rjg = await _rg.json();
      if (
        _rjg.notifications &&
        Array.isArray(_rjg.notifications) &&
        _rjg.notifications.length > 0
      ) {
        await _s(_c.name, _o, _p, _u);
        return { status: 200, id: _c.id };
      } else {
        switch (_rjg.numericErrorCode) {
          case 28015:
          case 28014:
          case 12720:
          case 28004:
            _eb.push({ bot: _c.name, status: _rjg.numericErrorCode });
            break;
          case 28001:
            if (_a < _m)
              return sendGift(_o, Number(_rjg.messageVars[1]), _u, _a + 1);
            else
              _eb.push({
                bot: _c.name,
                status: 28001,
                message: "Max reattempts reached",
              });
            break;
          default:
            _eb.push({ bot: _c.name, status: 400 });
            break;
        }
      }
    } catch (_ex) {
      console.error("Error en el proceso de fetch:", _ex.message);
    }
  }
  return _eb;
};
