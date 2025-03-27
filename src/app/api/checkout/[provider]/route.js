import { NextResponse } from "next/server";
import Order from "@/lib/models/order";
import Coupon from "@/lib/models/coupon";
import Product from "@/lib/models/product";
import Currency from "@/lib/models/currency";
import Stripe from "stripe";
import crypto from "crypto";
import { getShop } from "@/app/api/shop/route";
import Multiplier from "@/lib/models/multiplier";
import Ban from "@/lib/models/ban";

async function isDuplicateOrder(newOrderData) {
  const lastOrder = await Order.findOne({
    "shipping.email": newOrderData.shipping.email,
  }).sort({ timestamp: -1 });

  if (!lastOrder) return false;

  const isSameOrder =
    JSON.stringify(lastOrder.items) === JSON.stringify(newOrderData.items) &&
    JSON.stringify(lastOrder.shipping) ===
      JSON.stringify(newOrderData.shipping) &&
    lastOrder.coupon === newOrderData.coupon &&
    lastOrder.payment.method === newOrderData.payment.method &&
    lastOrder.currency.value === newOrderData.currency.value &&
    new Date() - new Date(lastOrder.timestamp) < 15 * 60 * 1000;

  return isSameOrder;
}

const executeDiscount = async (order) => {
  try {
    const couponUsed = await Coupon.findByIdAndUpdate(
      order.discount.id,
      { $inc: { uses: -1 } },
      { new: true }
    );

    if (couponUsed.uses === 0) {
      await Coupon.deleteOne({ _id: couponUsed._id });
    }
    return couponUsed.discount || 0;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw new Error("Failed to apply discount");
  }
};

export async function POST(request, { params }) {
  try {
    const { order } = await request.json();

    const banExist = await Ban.findOne({ email: order.shipping.email });
    if (banExist) {
      return NextResponse.json({ message: "Ban detected" }, { status: 400 });
    }

    const orderExist = await isDuplicateOrder(order);
    if (orderExist) {
      return NextResponse.json(
        { message: "Duplicate order detected" },
        { status: 400 }
      );
    }
    // Obtener los productos y monedas desde la base de datos
    const productIds = order.items
      .filter((item) => item.category !== "skin")
      .map((item) => item.id);

    const [dbProducts, dbCurrency, dbMultiplier, shopData] = await Promise.all([
      Product.find({ _id: { $in: productIds } }),
      Currency.findOne({ value: order.currency.value }),
      Multiplier.find({}),
      getShop(),
    ]);

    // Calcular el descuento del cupón
    let discountPercentage = 0;
    if (order.discount.value) {
      discountPercentage = await executeDiscount(order);
    }

    let total = 0;
    const stripeFixedFeePerProduct = 0.3 / order.items.length;
    const lineItems = await Promise.all(
      order.items.map(async (item) => {
        let price;
        if (item.category === "skin") {
          const skinPrice = shopData.shop.find(
            (skin) => skin.mainId === item.id
          ).price.finalPrice;
          price = Number(skinPrice * dbMultiplier[0].price);
        } else {
          const product = dbProducts.find(
            (prod) => prod._id.toString() === item.id
          );
          price = product ? Number(product.price) : 0;
        }
        const quantity = Math.max(item.quantity, 1); // Asegúrate de que la cantidad mínima sea 1

        let productPrice;
        if (order.payment.method === "crypto") {
          // No multiplicar por dbCurrency.price para criptomonedas
          productPrice = price;
        } else {
          // Multiplicar por dbCurrency.price para pagos con Stripe
          productPrice = price * dbCurrency.price;
        }

        // Aplicar el descuento del cupón
        const discountedPrice = productPrice * (1 - discountPercentage / 100);

        // Calcular el precio con la tarifa de Stripe
        let stripeFee = 0;
        if (order.payment.method === "stripe") {
          stripeFee =
            discountedPrice * (dbCurrency.value === "usd" ? 0.026 : 0.035) +
            stripeFixedFeePerProduct * dbCurrency.price;
        }
        const finalPrice = discountedPrice + stripeFee;

        total += finalPrice * quantity;

        return {
          price_data: {
            currency: order.currency.value,
            product_data: {
              name: item.name,
              images: [item.category === "skin" ? item.image : item.image.url], // Usa la imagen del producto desde la base de datos
            },
            unit_amount:
              dbCurrency.value === "clp"
                ? Math.round(finalPrice)
                : Math.round(finalPrice * 100), // Asegúrate de que los precios estén en el formato correcto (céntimos)
          },
          quantity: quantity,
        };
      })
    );

    const newOrder = new Order(order);
    const savedOrder = await newOrder.save();

    const successChat = order.items.some(
      (item) => item.category === "vbucks" || item.category === "pack"
    );

    const redirectUrl = `${process.env.NEXT_PUBLIC_REDIRECT_URL}/success${
      successChat
        ? `/chat?orderid=${savedOrder._id.toString().slice(-5).toUpperCase()}`
        : ""
    }`;

    if (params.provider === "stripe") {
      const stripe = new Stripe(process.env.STRIPE_CHECKOUT);
      const session = await stripe.checkout.sessions.create({
        success_url: redirectUrl,
        line_items: lineItems,
        phone_number_collection: {
          enabled: true,
        },
        billing_address_collection: "required",
        customer_email: order.shipping.email,
        metadata: {
          orderId: savedOrder._id.toString(),
        },
        mode: "payment",
      });
      return NextResponse.json(session);
    } else if (params.provider === "crypto") {
      const dataResponse = {
        amount: total.toString(), // No multiplicar por dbCurrency.price para criptomonedas
        currency: "USD",
        order_id: crypto.randomBytes(12).toString("hex"),
        url_callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/crypto`,
        url_success: redirectUrl,
        additional_data: savedOrder._id.toString(),
      };

      const sign = crypto
        .createHash("md5")
        .update(
          Buffer.from(JSON.stringify(dataResponse)).toString("base64") +
            process.env.CRYPTOMUS_API_KEY
        )
        .digest("hex");

      const response = await fetch("https://api.cryptomus.com/v1/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          merchant: process.env.CRYPTOMUS_MERCHANT_ID,
          sign: sign,
        },
        body: JSON.stringify(dataResponse),
      });

      const res = await response.json();
      if (!response.ok) {
        console.error("Crypto payment creation failed:", res);
        throw new Error("Crypto payment creation failed");
      }
      return NextResponse.json(res);
    } else if (params.provider === "transfer") {
      return NextResponse.json(
        `${redirectUrl}/transfer?orderid=${savedOrder._id
          .toString()
          .slice(-5)
          .toUpperCase()}&amount=${total}`
      );
    }
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { message: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
