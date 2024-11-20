import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 認証なしでアクセスできる公開ルート
  const publicRoutes = ['/login', '/signup', '/auth/callback'];
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  // 未ログイン状態でログインページにアクセスする場合はそのまま表示
  if (!session && isPublicRoute) {
    return res;
  }

  // 未ログイン状態で保護されたルートにアクセスした場合、ログインページにリダイレクト
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', req.url);
    // リダイレクト元のURLを保存（ログイン後に元のページに戻るため）
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ログイン済みの状態でログインページなどにアクセスした場合、ホームにリダイレクト
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

// ミドルウェアを適用するパスの設定
// 静的ファイル、API、faviconには適用しない
export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico).*)'],
};
