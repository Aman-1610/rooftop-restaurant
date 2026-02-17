"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                return;
            }

            // Check role
            const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            // Redirect chefs to kitchen display
            if (roleData?.role === 'chef') {
                router.replace('/kitchen');
                return;
            }

            setLoading(false);
        };

        checkUser();

        // Realtime Subscription for New Orders
        const channel = supabase
            .channel('admin-orders')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload: any) => {
                    console.log('New Order!', payload);
                    toast.success(`New Order #${payload.new.id}`, {
                        description: `Table: ${payload.new.table_no || 'Delivery'} - ₹${payload.new.total_amount}`,
                        duration: 5000,
                        action: {
                            label: 'View',
                            onClick: () => router.push(`/admin/orders/${payload.new.id}`)
                        }
                    });
                    // Optional: Play beep
                    // const audio = new Audio('/beep.mp3'); 
                    // audio.play().catch(e => console.log('Audio play failed', e));
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
        <div className="flex bg-slate-100 min-h-screen">
            <Toaster position="top-right" richColors />
            {/* Sidebar - hidden on mobile by default, shown via hamburger */}
            <div className="lg:w-64 lg:flex-shrink-0 lg:fixed lg:h-full lg:z-10">
                <AdminSidebar />
            </div>
            {/* Main content - full width on mobile, offset on desktop */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-x-hidden min-h-screen w-full">
                {children}
            </main>
        </div>
    );
}
