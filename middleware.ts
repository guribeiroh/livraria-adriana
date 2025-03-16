import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  try {
    // Checar se as variáveis de ambiente estão disponíveis
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Middleware: Variáveis de ambiente do Supabase não encontradas');
      return res;
    }

    // Determinar o domínio para os cookies
    const url = new URL(req.url);
    const isLocalhost = url.hostname === 'localhost';
    
    // Criar o cliente Supabase
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => req.cookies.get(name)?.value,
          set: (name, value, options) => {
            res.cookies.set({ 
              name, 
              value, 
              ...options,
              // Não definir domínio em localhost
              ...(isLocalhost ? {} : { 
                domain: url.hostname,
                secure: true,
                sameSite: 'lax' 
              })
            });
          },
          remove: (name, options) => {
            res.cookies.set({ 
              name, 
              value: '', 
              ...options,
              // Não definir domínio em localhost
              ...(isLocalhost ? {} : { 
                domain: url.hostname,
                secure: true,
                sameSite: 'lax' 
              })
            });
          },
        },
      }
    );
    
    // Verificar se o usuário está autenticado
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Middleware: Erro ao obter sessão do usuário:', error.message);
      return res;
    }
    
    const session = data.session;
    
    // Lista de rotas que requerem autenticação
    const protectedRoutes = [
      '/perfil',
      '/carrinho/checkout'
    ];
    
    // Verificar se a rota atual está protegida
    const isProtectedRoute = protectedRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    );
    
    // Se a rota for protegida e o usuário não estiver autenticado, redirecionar para login
    if (isProtectedRoute && !session?.user) {
      const url = new URL('/login', req.url);
      url.searchParams.set('next', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return res;
  } catch (error) {
    console.error('Middleware: Erro inesperado:', error);
    return res;
  }
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