"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setTableNumber } from "@/store/cartSlice";
import { Store, ArrowRight, UtensilsCrossed } from "lucide-react";

export default function DineInHandler({ searchParams }: { searchParams: Promise<{ table?: string }> }) {
    const params = use(searchParams);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (params.table) {
            dispatch(setTableNumber(params.table));
            router.push("/menu");
        }
    }, [params, dispatch, router]);

    const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const table = formData.get("table") as string;
        if (table) {
            dispatch(setTableNumber(table));
            router.push("/menu");
        }
    };

    if (params.table) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">Setting up your table...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 text-center">
                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UtensilsCrossed size={40} className="text-amber-500" />
                </div>

                <h1 className="text-3xl font-serif font-bold text-slate-100 mb-2">Dine-in Ordering</h1>
                <p className="text-slate-400 mb-8">Please enter your table number to view the menu and order.</p>

                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="relative">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            name="table"
                            required
                            placeholder="Enter Table Number (e.g. 5)"
                            className="w-full pl-12 pr-4 py-4 bg-slate-900 rounded-xl border border-slate-600 focus:border-amber-500 outline-none text-slate-100 font-bold text-lg text-center"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        Start Ordering <ArrowRight size={20} />
                    </button>
                </form>

                <p className="text-xs text-slate-500 mt-6">
                    Scan the QR code on your table for automatic access.
                </p>
            </div>
        </div>
    );
}
