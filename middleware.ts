import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 公開ルートの定義
  const publicRoutes = ['/login', '/auth/callback'];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  // ログインしていない状態で保護されたルートにアクセスした場合
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ログイン済みの状態でログインページにアクセスした場合
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

// ミドルウェアを適用するパスの設定
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
