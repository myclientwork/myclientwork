import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function safeNextPath(value: string | null) {
  return value?.startsWith('/') && !value.startsWith('//')
    ? value
    : null;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const requestedNext = safeNextPath(requestUrl.searchParams.get('next'));

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=missing_code', requestUrl.origin)
    );
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL('/auth/login?error=oauth_callback', requestUrl.origin)
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL('/auth/login?error=missing_user', requestUrl.origin)
    );
  }

  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!existingProfile) {
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'User';

    await supabase.from('user_profiles').insert({
      id: user.id,
      email: user.email!,
      full_name: fullName,
    });
  }

  const destination =
    requestedNext ||
    (existingProfile?.role === 'admin' ? '/admin' : '/dashboard');

  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
