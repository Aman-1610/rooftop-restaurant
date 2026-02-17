
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // 1. Get current user
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized: Not logged in' }, { status: 401 });
        }

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'Server misconfiguration: Missing Service Role Key' }, { status: 500 });
        }

        // 2. Insert/Update user as admin in user_roles
        const { error } = await supabaseAdmin
            .from('user_roles')
            .upsert({
                id: user.id,
                email: user.email,
                role: 'admin',
                name: user.user_metadata?.name || 'Admin',
                created_at: new Date().toISOString()
            });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
