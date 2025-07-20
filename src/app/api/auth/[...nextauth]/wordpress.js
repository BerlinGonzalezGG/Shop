import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";

/**
 * Endpoint especial de autenticación para WordPress
 * Permite que el plugin de WordPress se autentique sin NextAuth
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const { token } = await request.json();
    
    // Validar token de WordPress
    if (token === process.env.WORDPRESS_API_TOKEN) {
      return NextResponse.json({ 
        success: true, 
        message: "WordPress authenticated successfully" 
      });
    }
    
    return NextResponse.json({ 
      error: "Invalid WordPress token" 
    }, { status: 401 });
    
  } catch (error) {
    console.error("WordPress auth error:", error);
    return NextResponse.json({ 
      error: "Server error" 
    }, { status: 500 });
  }
}
