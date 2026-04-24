'use server';

import { cookies } from 'next/headers';

/**
 * LÓGICA DE AUTENTICACIÓN ADMIN (.env)
 * Este sistema es un placeholder para ser migrado a Firebase en el futuro.
 */
export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Credenciales desde el .env
  const userAdmin = process.env.userAdmin;
  const passwordAdmin = process.env.passwordAdmin;

  if (email === userAdmin && password === passwordAdmin) {
    (await cookies()).set('auth_type', 'admin', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Credenciales de administrador incorrectas' };
}

export async function logout() {
  (await cookies()).delete('auth_type');
}
