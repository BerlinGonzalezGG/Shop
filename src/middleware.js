import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  /*
  if (pathname.startsWith('/api/')) {
    // Obtén el origen de la solicitud
    const requestOrigin = request.headers.get('origin');
    // Verifica si el origen es permitido
    if (requestOrigin !== ALLOWED_ORIGIN) {
      return NextResponse.json(
        { message: 'CORS error' },
        { status: 403 }
      );
      
    }
  }*/

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
