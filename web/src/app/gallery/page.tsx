"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";

// Placeholder images from Unsplash (Rooftop, Night, Food, Vibe)
const galleryCategories = [
    {
        id: 1, title: "Ambience", images: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070",
            "https://images.unsplash.com/photo-1566417713204-38c9e7218175?q=80&w=2070"
        ]
    },
    {
        id: 2, title: "Culinary", images: [
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974",
            "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070"
        ]
    },
    {
        id: 3, title: "Moments", images: [
            "https://images.unsplash.com/photo-1519671482538-518b48d8badc?q=80&w=2070",
            "https://images.unsplash.com/photo-1424847651672-bf202175b6d4?q=80&w=2070",
            "https://images.unsplash.com/photo-1551632436-cbf8dd354ca8?q=80&w=2069"
        ]
    }
];

export default function GalleryPage() {
    return (
        <main className="min-h-screen bg-slate-900 text-slate-50 font-sans">
            <Header />

            {/* Hero */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1974')] bg-cover bg-center opacity-30 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900" />
                </div>
                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-slate-100 mb-4"
                    >
                        Our <span className="text-amber-500">Gallery</span>
                    </motion.h1>
                    <p className="text-xl text-slate-300">A glimpse into the Rooftop experience</p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-20 px-4 max-w-7xl mx-auto space-y-24">
                {galleryCategories.map((category) => (
                    <div key={category.id}>
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-200">{category.title}</h2>
                            <div className="h-[1px] bg-slate-700 flex-grow"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {category.images.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative group rounded-2xl overflow-hidden aspect-[4/3] border border-slate-800 hover:border-amber-500/50"
                                    whileHover={{ y: -5 }}
                                >
                                    <Image
                                        src={img}
                                        alt={`${category.title} ${idx}`}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            <Footer />
        </main>
    );
}
