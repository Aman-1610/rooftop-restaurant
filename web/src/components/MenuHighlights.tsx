"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Mock Data for Highlights
const mockHighlights = [
    {
        id: 1,
        name: "Tandoori Platter",
        description: "Assortment of kabs and tikkas cooked in clay oven.",
        price: 550,
        image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2080&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Grilled Fish",
        description: "Marinated in lemon butter garlic sauce, served with veggies.",
        price: 480,
        image_url: "https://images.unsplash.com/photo-1544025162-d76690b6860d?q=80&w=2069&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Chocolate Fondant",
        description: "Molten chocolate cake with vanilla bean ice cream.",
        price: 290,
        image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?q=80&w=1974&auto=format&fit=crop"
    }
];

export default function MenuHighlights() {
    const [highlights, setHighlights] = useState<any[]>(mockHighlights);

    useEffect(() => {
        if (!supabase) return;
        const fetchHighlights = async () => {
            const { data } = await supabase
                .from('menu_items')
                .select('*')
                .eq('is_featured', true)
                .limit(3);

            if (data && data.length > 0) {
                setHighlights(data);
            }
        };
        fetchHighlights();
    }, []);
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-amber-500 font-serif uppercase tracking-widest mb-2">Our Specialties</p>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100">Chef's <span className="text-amber-500">Favorites</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {highlights.map((item: any, idx: number) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/30 group"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors">{item.name}</h3>
                                    <span className="text-amber-500 font-bold">₹{item.price}</span>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">{item.description}</p>
                                <div className="flex gap-1 text-amber-500 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/menu" className="inline-flex items-center gap-2 text-slate-300 hover:text-amber-400 font-medium group transition-colors">
                        View Full Menu <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
