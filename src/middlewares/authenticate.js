import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export const authenticate = async (request) => {
  // Primero intentar autenticación WordPress
  if (request) {
    try {
      const body = await request.clone().json(); // Clone request to avoid consumption
      
      if (body.wpToken && body.wpToken === process.env.WORDPRESS_API_TOKEN) {
        return { session: { wordpress: true } }; // Autenticación WordPress exitosa
      }
    } catch (error) {
      // Si falla parsing JSON, continuar con NextAuth
    }
  }

  // Autenticación NextAuth normal
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }
  
  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return { error: "Unauthorized", status: 401 };
    }
    return { session };
  } catch (error) {
    return { error: "Unauthorized", status: 401 };
  }
};
