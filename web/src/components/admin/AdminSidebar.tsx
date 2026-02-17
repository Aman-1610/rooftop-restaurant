"use client";

import Link from "next/link";
import { LayoutDashboard, Utensils, Calendar, Settings, LogOut, ShoppingCart, ChefHat, MessageSquare, QrCode, Users, Image as ImageIcon, Star } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        router.push("/login");
    };

    const links = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
        { name: "Kitchen Display", href: "/admin/kitchen", icon: ChefHat },
        { name: "QR Codes", href: "/admin/qr-codes", icon: QrCode },
        { name: "Menu Manager", href: "/admin/menu", icon: Utensils },
        { name: "Manage Gallery", href: "/admin/gallery", icon: ImageIcon },
        { name: "Testimonials", href: "/admin/testimonials", icon: Star },
        { name: "Reservations", href: "/admin/reservations", icon: Calendar },
        { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
        { name: "Manage Staff", href: "/admin/staff", icon: Users },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (

        <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen fixed left-0 top-0 overflow-y-auto z-50">

            {/* ... header */}
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-serif font-bold text-amber-500">Admin Panel</h1>
                <p className="text-xs text-slate-500">The Rooftop Restaurant</p>
            </div>

            <nav className="p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-amber-500 text-slate-900 font-bold"
                                : "text-slate-400 hover:bg-slate-800 hover:text-amber-400"
                                }`}
                        >
                            <Icon size={20} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full rounded-lg transition-colors font-bold"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
