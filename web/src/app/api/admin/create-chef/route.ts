import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        // 1. Check if the current user is an admin
        // To do this securely, we need to read their session cookies and check their role.
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized: Not logged in' }, { status: 401 });
        }

        // Check if user is admin in user_roles table
        // We use supabaseAdmin here to bypass RLS potentially, but regular supabase client should work
        // if RLS policies are correct ("users can read own role").
        const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (roleError || roleData?.role !== 'admin') {
            // Allow initial setup: if no admins exist, allow creation?
            // Or just fail. For now, let's fail.
            // But for the user testing, maybe they haven't set up user_roles yet.
            // Let's check if the table is empty? No, security risk.
            // I will skip this strict check for MVP or check against a hardcoded email?
            // No, let's trust the role check. The user MUST insert themselves as admin first.
            return NextResponse.json({ error: 'Unauthorized: Not an admin' }, { status: 403 });
        }

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'Server misconfiguration: Missing Service Role Key' }, { status: 500 });
        }

        // 2. Create the new user using Admin API
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name }
        });

        if (createError) {
            return NextResponse.json({ error: createError.message }, { status: 400 });
        }

        if (!newUser.user) {
            return NextResponse.json({ error: 'Failed to create user object' }, { status: 500 });
        }

        // 3. Add to user_roles table with 'chef' role
        const { error: roleInsertError } = await supabaseAdmin
            .from('user_roles')
            .insert({
                id: newUser.user.id,
                email: email,
                role: 'chef',
                name: name
            });

        if (roleInsertError) {
            // Rollback user creation? Hard with Supabase.
            // Just return error and let admin retry or fix manually.
            return NextResponse.json({ error: 'User created but role assignment failed: ' + roleInsertError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, user: newUser.user });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
