import userPaymentConfirmed from '../../../../emails/user-payment-confirmed';
import adminPaymentConfirmed from '../../../../emails/admin-payment-confirmed';
import { NextResponse } from "next/server";
import { authenticate } from '@/middlewares/authenticate';

import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const authResult = await authenticate();
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }
  
  const body = await request.json();
  if (!body.order) {
    return NextResponse.json({ error: 'Order not found in request body' }, { status: 400 });
  }

  const emailSent = await sendEmail(body)
  return NextResponse.json(emailSent)

}

export async function sendEmail(body){
  try {
    const emailDetails = {
      from: 'Berlin Gonzalez Shop <support@berlingonzalez.gg>',
      to: body.type === 'admin' ? 'berlingonzalezshop@gmail.com' : body.order.shipping.email,
      subject: body.type === 'admin' ? 'New payment confirmed' : 'Payment confirmed',
      react: body.type === 'admin' ? adminPaymentConfirmed(body.order) : userPaymentConfirmed(body.order),
    };

    const { data, error } = await resend.emails.send(emailDetails);

    if (error) {
      console.error("Error sending email:", error);
      return ({ message: 'Error sending email' }, { status: 500 });
    }

    return data
  } catch (error) {
    console.error("Error processing request:", error);
    return ({ message: 'Internal server error' }, { status: 500 });
  }
}
