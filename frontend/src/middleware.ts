import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * MIDDLEWARE DE PROTECCIÓN
 * 
 * Este archivo protege las rutas de administración.
 * Actualmente usa la cookie 'auth_type' (Placeholder).
 * 
 * CUANDO LLEGUE FIREBASE:
 * Se deberá cambiar la lógica para verificar la cookie de sesión de Firebase
 * o el token JWT que ellos generen.
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protegemos cualquier ruta que empiece con /admin
  if (pathname.startsWith('/admin')) {
    const authType = request.cookies.get('auth_type')?.value;

    // Si no tiene la cookie de admin, redirigimos al login
    if (authType !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configuramos el middleware para que solo actúe en las rutas deseadas
export const config = {
  matcher: ['/admin/:path*'],
};
