"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const mockImages = [
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
];

export default function GalleryPreview() {
    const [images, setImages] = useState<string[]>(mockImages);

    useEffect(() => {
        const fetchImages = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('gallery_images')
                .select('image_url')
                // .limit(4) // Optional to limit
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                // If we have less than 4 images, maybe mix with mock? Or just show what we have.
                // Layout expects 4 for the specific grid spans.
                // Let's just use what we have. If fewer than 4, UI might look a bit different but okay.
                // Actually, let's take up to 4.
                setImages(data.map((item: { image_url: string }) => item.image_url).slice(0, 4));
            }
        };
        fetchImages();
    }, []);

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <span className="text-amber-500 font-serif uppercase tracking-widest text-sm font-bold">Rooftop Ambiance</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-100 mt-2">A Night to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Remember</span></h2>
                    </div>
                    <Link href="/gallery" className="mt-8 md:mt-0 px-8 py-3 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-400 rounded-full transition-all group flex items-center gap-2">
                        View Full Gallery <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 h-[60vh] md:h-[500px]">
                    {images.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            className={`relative rounded-3xl overflow-hidden group ${idx === 0 || idx === 3 ? 'md:col-span-2' : ''}`}
                        >
                            <Image
                                src={img}
                                alt={`Gallery image ${idx + 1}`}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
