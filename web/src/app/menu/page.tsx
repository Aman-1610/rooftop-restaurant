"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Flame, Leaf } from "lucide-react";
import { fetchMenuItems } from "@/services/menuService";
import { useDispatch } from "react-redux";
import { addToCart, toggleCart } from "@/store/cartSlice";

const categories = ["All", "Starters", "Main Course", "Drinks", "Desserts"];

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [items, setItems] = useState<any[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function loadData() {
            const data = await fetchMenuItems();
            setItems(data || []);
        }
        loadData();
    }, []);

    const handleAddToCart = (item: any) => {
        dispatch(addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        }));
        dispatch(toggleCart()); // Open cart to show item added
    };

    const filteredItems = activeCategory === "All"
        ? items
        : items.filter(item => item.category === activeCategory);

    return (
        <main className="min-h-screen bg-slate-900 text-slate-50 font-sans">
            <Header />

            {/* Menu Header */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                        alt="Menu Banner"
                        fill
                        className="object-cover opacity-40 blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/50 to-slate-900" />
                </div>
                <div className="relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-amber-500 mb-4"
                    >
                        Our Menu
                    </motion.h1>
                    <p className="text-xl text-slate-300">Curated flavors for every palate</p>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="py-10 px-4 sticky top-20 z-40 bg-slate-900/95 backdrop-blur shadow-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === cat
                                ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/25 scale-105"
                                : "bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Menu Grid */}
            <section className="py-16 px-4 max-w-7xl mx-auto min-h-screen">
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={item.id}
                                className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-amber-500/50 transition-all group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={item.image_url || item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {item.is_popular && (
                                            <span className="px-3 py-1 bg-amber-500 text-xs font-bold text-slate-900 rounded-full flex items-center gap-1 shadow-lg">
                                                <Star size={12} fill="currentColor" /> Bestseller
                                            </span>
                                        )}
                                        {item.is_spicy && (
                                            <span className="px-3 py-1 bg-red-600 text-xs font-bold text-white rounded-full flex items-center gap-1 shadow-lg">
                                                <Flame size={12} fill="currentColor" /> Spicy
                                            </span>
                                        )}
                                        {item.is_veg && (
                                            <span className="px-3 py-1 bg-green-600 text-xs font-bold text-white rounded-full flex items-center gap-1 shadow-lg">
                                                <Leaf size={12} fill="currentColor" /> Veg
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-amber-400 transition-colors">{item.name}</h3>
                                        <span className="text-amber-500 font-bold text-lg">₹{item.price}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-6 h-12 overflow-hidden">{item.description}</p>

                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full py-3 bg-slate-700 hover:bg-amber-500 hover:text-slate-900 text-slate-300 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        Add to Order
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-xl">No items found in this category.</p>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
