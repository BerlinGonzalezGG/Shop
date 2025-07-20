import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token } = await request.json();
    
    // Verificar token de WordPress
    if (token !== process.env.WORDPRESS_API_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'WordPress authenticated successfully' 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
