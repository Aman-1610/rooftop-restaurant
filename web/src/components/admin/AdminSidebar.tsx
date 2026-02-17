"use client";

import Link from "next/link";
import { LayoutDashboard, Utensils, Calendar, Settings, LogOut, ShoppingCart, ChefHat, MessageSquare, QrCode, Users, Image as ImageIcon, Star, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        router.push("/login");
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
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
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-amber-500 rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-slate-900 border-r border-slate-800 min-h-screen fixed left-0 top-0 overflow-y-auto z-50
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Header */}
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-serif font-bold text-amber-500">Admin Panel</h1>
                    <p className="text-xs text-slate-500">The Rooftop Restaurant</p>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 pb-24">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={closeMobileMenu}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-amber-500 text-slate-900 font-bold"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-amber-400"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="text-sm">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full rounded-lg transition-colors font-bold"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
