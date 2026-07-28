import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Solo aplicar a /admin y subrutas
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Si la ruta es el login, permitir acceso
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Verificar si existe la cookie de autenticación
    const pda = request.cookies.get('pudu_admin_auth');

    if (!pda || pda.value !== 'authenticated') {
      // Redirigir al login si no está autenticado
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

