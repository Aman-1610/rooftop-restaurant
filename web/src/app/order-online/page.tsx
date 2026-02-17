"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrderPage() {
    return (
        <main className="min-h-screen bg-slate-900 text-slate-50 font-sans">
            <Header />
            <div className="flex items-center justify-center min-h-[60vh] text-center">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-amber-500 mb-4">Order Online</h1>
                    <p className="text-slate-400">Our online ordering system is under construction. Please call us to order.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
