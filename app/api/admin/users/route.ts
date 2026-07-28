import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabasePublicConfig } from '@/shared/config/supabase-env';

const createUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
  full_name: z.string().trim().max(120).optional().default(''),
  role: z.enum(['user', 'admin']).default('user'),
});

const updateUserSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().trim().max(120).nullable(),
  phone: z.string().trim().max(40).nullable(),
  company: z.string().trim().max(120).nullable(),
  country: z.string().trim().max(120).nullable(),
  role: z.enum(['user', 'admin']),
  status: z.enum(['active', 'suspended']),
});

const deleteUserSchema = z.object({
  id: z.string().uuid(),
});

async function getAdminContext() {
  const sessionClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }) };
  }

  const { data: profile } = await sessionClient
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Admin access required.' }, { status: 403 }) };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return {
      error: NextResponse.json(
        { error: 'Admin user management is not configured on the server.' },
        { status: 503 }
      ),
    };
  }

  const { url } = getSupabasePublicConfig();
  const adminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return { user, adminClient };
}

async function isLastAdmin(adminClient: SupabaseClient, userId: string) {
  const [{ data: target }, { count }] = await Promise.all([
    adminClient.from('user_profiles').select('role').eq('id', userId).maybeSingle(),
    adminClient
      .from('user_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin'),
  ]);

  return target?.role === 'admin' && (count ?? 0) <= 1;
}

export async function POST(request: Request) {
  const context = await getAdminContext();
  if ('error' in context) return context.error;

  const parsed = createUserSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid user details.' },
      { status: 400 }
    );
  }

  const { email, password, full_name, role } = parsed.data;
  const { data, error } = await context.adminClient.auth.admin.createUser({
    email: email.toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? 'Unable to create the user.' },
      { status: 400 }
    );
  }

  const { error: profileError } = await context.adminClient
    .from('user_profiles')
    .upsert({
      id: data.user.id,
      email: data.user.email!,
      full_name: full_name || null,
      role,
      status: 'active',
    });

  if (profileError) {
    await context.adminClient.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.user.id }, { status: 201 });
}

export async function PATCH(request: Request) {
  const context = await getAdminContext();
  if ('error' in context) return context.error;

  const parsed = updateUserSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid user details.' },
      { status: 400 }
    );
  }

  const payload = parsed.data;
  if (payload.id === context.user.id && payload.status === 'suspended') {
    return NextResponse.json({ error: 'You cannot suspend your own account.' }, { status: 400 });
  }

  if (payload.role === 'user' && (await isLastAdmin(context.adminClient, payload.id))) {
    return NextResponse.json({ error: 'The last admin cannot be demoted.' }, { status: 400 });
  }

  const { error } = await context.adminClient
    .from('user_profiles')
    .update({
      full_name: payload.full_name,
      phone: payload.phone,
      company: payload.company,
      country: payload.country,
      role: payload.role,
      status: payload.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const context = await getAdminContext();
  if ('error' in context) return context.error;

  const parsed = deleteUserSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid user identifier.' }, { status: 400 });
  }

  if (parsed.data.id === context.user.id) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
  }

  if (await isLastAdmin(context.adminClient, parsed.data.id)) {
    return NextResponse.json({ error: 'The last admin cannot be deleted.' }, { status: 400 });
  }

  const { error } = await context.adminClient.auth.admin.deleteUser(parsed.data.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
