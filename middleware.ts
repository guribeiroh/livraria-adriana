import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Criar o cliente Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  // Verificar se o usuário está autenticado
  const { data: { session } } = await supabase.auth.getSession();
  
  // Lista de rotas que requerem autenticação
  const protectedRoutes = [
    '/perfil',
    '/admin',
    '/carrinho/checkout'
  ];
  
  // Lista de rotas que requerem permissão de administrador
  const adminRoutes = [
    '/admin'
  ];
  
  // Verificar se a rota atual está protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );
  
  // Verificar se a rota atual requer permissão de administrador
  const isAdminRoute = adminRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );
  
  // Se a rota for protegida e o usuário não estiver autenticado, redirecionar para login
  if (isProtectedRoute && !session?.user) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // Se a rota requerer permissão de administrador, verificar o perfil do usuário
  if (isAdminRoute && session?.user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (!data || data.role !== 'admin') {
      // Redirecionar para a página inicial se não for administrador
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

// Configurar quais caminhos o middleware deve ser executado
export const config = {
  // Aplicar a rotas específicas que requerem verificação
  matcher: [
    '/perfil/:path*',
    '/admin/:path*',
    '/carrinho/checkout'
  ],
}; 