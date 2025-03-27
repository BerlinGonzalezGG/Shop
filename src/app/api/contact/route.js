import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER, // Tu correo de Gmail
    pass: process.env.EMAIL_SERVER_PASSWORD, // Tu contraseña de Gmail
  },
});

const sendEmail = async ({ name, email, message }) => {
  const mailOptions = {
    from: `Berlin Gonzalez <${process.env.EMAIL_FROM}>`, // Dirección de origen
    to: "berlingonzalezserrano@gmail.com",   // Dirección de destino (puedes cambiar esto si quieres enviar el correo a otra dirección)
    subject: 'Contacto de BerlinGonzalez Shop', // Asunto
    text: `Has recibido un nuevo mensaje de contacto:\n\nNombre: ${name}\nEmail: ${email}\nMensaje: ${message}`, // Cuerpo del correo con los detalles del contacto
  };
  
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error);
        return reject(error);
      }
      resolve(info);
    });
  });
};

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || !body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Faltan datos en el cuerpo de la solicitud' }, { status: 400 });
    }

    const emailSent = await sendEmail(body);
    return NextResponse.json({ message: 'Correo enviado exitosamente', info: emailSent });
  } catch (error) {
    return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
  }
}
