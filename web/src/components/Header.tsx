"use client";

import Link from "next/link";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toggleCart } from "@/store/cartSlice";
// ... imports
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { Globe, ShoppingCart } from "lucide-react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const { language, setLanguage, t } = useLanguage();
    const { settings } = useSettings();

    const toggleMenu = () => setIsOpen(!isOpen);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    // Helper to format name with two colors
    const renderLogo = () => {
        const name = settings?.navbar_title || settings?.restaurant_name || "ROOFTOP Dining";
        const parts = name.split(" ");
        if (parts.length > 1) {
            return (
                <>
                    {parts[0]}<span className="text-slate-100">{parts.slice(1).join(" ")}</span>
                </>
            );
        }
        return name;
    };

    return (
        <header className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-serif font-bold text-amber-500 tracking-wider">
                            {renderLogo()}
                        </Link>
                    </div>
                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="text-slate-300 hover:text-amber-400 transition-colors">{t('nav_home')}</Link>
                        <Link href="/menu" className="text-slate-300 hover:text-amber-400 transition-colors">{t('nav_menu')}</Link>
                        <Link href="/reservations" className="text-slate-300 hover:text-amber-400 transition-colors">{t('nav_reservations')}</Link>
                        <Link href="/gallery" className="text-slate-300 hover:text-amber-400 transition-colors">{t('nav_gallery')}</Link>

                        <button
                            onClick={toggleLanguage}
                            className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 text-sm font-medium"
                        >
                            <Globe size={18} />
                            {language === 'en' ? 'HI' : 'EN'}
                        </button>

                        <button
                            onClick={() => dispatch(toggleCart())}
                            className="relative p-2 text-slate-300 hover:text-amber-400 transition-colors"
                        >
                            <ShoppingCart size={24} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-slate-300 hover:text-amber-400 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div >

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800">
                            Home
                        </Link>
                        <Link href="/menu" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800">
                            Menu
                        </Link>
                        <Link href="/reservations" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800">
                            Reservations
                        </Link>
                        <Link href="/gallery" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800">
                            Gallery
                        </Link>
                        <Link
                            href="/order-online"
                            className="block w-full text-center mt-4 px-5 py-3 bg-amber-500 text-slate-900 font-bold rounded-md hover:bg-amber-400"
                        >
                            Order Online
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
