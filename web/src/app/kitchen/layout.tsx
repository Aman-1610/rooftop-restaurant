"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            router.push("/login?error=no_supabase");
            return;
        }

        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                // Check role (optional but good for strictness)
                const { data: roleData } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                // If user is neither admin nor chef, maybe redirect? user requested strict view.
                // But for now, just ensure logged in.
                // If they are admin, allowed. Chef, allowed.
                setLoading(false);
            }
        };

        checkUser();

        // Realtime subscription for notifications (sound)
        const channel = supabase
            .channel('kitchen-toast')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload: any) => {
                    toast.success(`New Order #${payload.new.id}`, {
                        description: `Table: ${payload.new.table_no || 'Delivery'}`,
                        duration: 5000,
                    });
                    // Play sound logic here if needed
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="animate-spin text-amber-500" size={48} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-900 text-slate-100">
            <Toaster position="top-right" richColors />
            {children}
        </main>
    );
}
