import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongo";
import Order from "@/lib/models/order";
import Stripe from "stripe";
import { sendGift } from "../../gift/route";
import crypto from "crypto";
import { sendEmail } from "../../send/route";
import userPaymentConfirmed from "../../../../../emails/user-payment-confirmed";
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderEmails(order) {
  const cuerpoUser = { type: "user", order };
  const cuerpoAdmin = { type: "admin", order };
  await sendEmail(cuerpoUser);
  await sendEmail(cuerpoAdmin);
}

async function handleGifts(orderId, updatedOrder, skinItems) {
  try {
    for (const item of skinItems) {
      try {
        const sentGift = await sendGift(
          item.offerId,
          item.skinprice,
          updatedOrder.shipping.fortnite.username
        );

        if (
          sentGift.message ||
          (Array.isArray(sentGift) && sentGift.length > 1)
        ) {
          continue;
        }

        await Order.updateOne(
          { _id: orderId, "items.id": item.id },
          { $set: { "items.$.delivered": true } }
        );

        skinItems.find((p) => p.id === item.id).delivered = true;
      } catch (error) {
        console.error("Error sending gift:", error);
      }
    }

    updatedOrder = await Order.findById(orderId);
    if (
      skinItems.length === updatedOrder.items.length &&
      skinItems.every((item) => item.delivered)
    ) {
      await Order.findByIdAndUpdate(
        orderId,
        { status: true },
        { new: true }
      );
    }
  } catch (error) {
    console.error("Error handling gifts:", error);
  }
  return updatedOrder;
}

async function handleStripeWebhook(event) {
  if (!event.data || !event.data.object) {
    return { status: 400, error: "Invalid event data" };
  }

  const checkoutSessionCompleted = event.data.object;
  const orderId = checkoutSessionCompleted.metadata.orderId;

  try {
    await connectDB();

    const currentOrder = await Order.findById(orderId);
    if (!currentOrder) throw new Error("Order not found");

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        payment: {
          id: checkoutSessionCompleted.id,
          status: true,
          method: "stripe",
        },
        shipping: {
          ...currentOrder.shipping,
          phone: checkoutSessionCompleted.customer_details.phone,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedOrder) throw new Error("Order could not be updated");

    
    const skinItems = updatedOrder.items.filter((item) => item.category === "skin");
    if (skinItems.length > 0) {
      await handleGifts(orderId, updatedOrder, skinItems);
    }
    const fileItems = updatedOrder.items.filter((item) => item.category === 'download')
    if(fileItems.length > 0){
      await handleFiles(updatedOrder)
    }else{
      await sendOrderEmails(updatedOrder);
    }
    
    return { status: 200 };
  } catch (error) {
    console.log(error)
    return { status: 500, error: error.message };
  }
}

async function handleExpiredCheckoutSession(event) {
  if (!event.data || !event.data.object) {
    return { status: 400, error: "Invalid event data" };
  }

  const expiredSession = event.data.object;
  const orderId = expiredSession.metadata.orderId;

  try {
    await connectDB();
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) throw new Error("Order not found or could not be deleted");

    return { status: 200 };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

async function handleCryptoWebhook(data) {
  const orderId = data.additional_data;


  try {
    await connectDB();

    const currentOrder = await Order.findById(orderId);
    if (!currentOrder) throw new Error("Order not found");

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        payment: { id: data.uuid, status: true, method: "crypto" }
      },
      {
        new: true,
      }
    );

    if (!updatedOrder) throw new Error("Order could not be updated");

    await sendOrderEmails(updatedOrder);
    const skinItems = updatedOrder.items.filter((item) => item.category === "skin");
    if (skinItems.length > 0) {
      await handleGifts(orderId, updatedOrder, skinItems);
    }

    return { status: 200 };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

export async function POST(request, { params }) {
  const body = await request.text();
  const provider = params.provider;

  if (provider === "stripe") {
    const stripe = new Stripe(process.env.STRIPE_CHECKOUT);
    const endpointSecret = process.env.STRIPE_SECRET;
    const headersList = headers();
    const sig = headersList.get("stripe-signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (error) {
      console.error("Error verifying Stripe webhook signature:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed":
        const response = await handleStripeWebhook(event);
        return NextResponse.json(null, { status: response.status });

      case "checkout.session.expired":
        await handleExpiredCheckoutSession(event);
        return NextResponse.json(null, { status: 200 });

      default:
        return NextResponse.json(null, { status: 400 });
    }
  }

  if (provider === "crypto") {
    const data = JSON.parse(body);
    const { sign } = data;
    delete data.sign;

    const hash = crypto
      .createHash("md5")
      .update(
        Buffer.from(JSON.stringify(data)).toString("base64") +
          process.env.CRYPTOMUS_API_KEY
      )
      .digest("hex");

    if (hash !== sign) {
      console.error("Crypto webhook signature mismatch");
      return NextResponse.json(null, { status: 400 });
    }

    if (data.status === "paid") {
      const response = await handleCryptoWebhook(data);
      return NextResponse.json(null, { status: response.status });
    }
  }

  return NextResponse.json(null, { status: 400 });
}

async function handleFiles(order) {
  try {
    const filePath = path.resolve(`files/${order.items.find(e => e.category === 'download')?.download}`);
    const fileContent = fs.readFileSync(filePath).toString('base64');
    const attachment = {
      filename: order.items.find(e => e.category === 'download')?.download, // Nombre del archivo para el destinatario
      content: fileContent,
    };

    const emailDetails = {
      from: 'Berlin Gonzalez Shop <support@berlingonzalez.gg>',
      to: order.shipping.email,
      subject: "Your file is ready",
      react: userPaymentConfirmed(order),
      attachments: [attachment],
    };

    const { data, error } = await resend.emails.send(emailDetails);

    if (error) {
      console.error("Error enviando el correo:", error);
      return ({ message: 'Error enviando el correo' }, { status: 500 });
    }

    return data;
  } catch (error) {
    console.error("Error procesando la solicitud:", error);
    return ({ message: 'Error interno del servidor' }, { status: 500 });
  }
}