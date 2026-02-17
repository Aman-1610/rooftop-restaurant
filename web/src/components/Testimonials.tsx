"use client";

import { motion } from "framer-motion";
import { Star, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const mockReviews = [
    {
        id: 1,
        name: "Ravi Kumar",
        rating: 5,
        text: "The best rooftop experience in Kahalgaon! The view of the sunset is mesmerizing and the food is absolutely delicious.",
        source: "Google Reviews"
    },
    {
        id: 2,
        name: "Anjali Singh",
        rating: 5,
        text: "Perfect for family dinners. The staff is very polite and the ambiance is just wow. Highly recommend the Butter Chicken.",
        source: "Google Reviews"
    },
    {
        id: 3,
        name: "Amit & Priya",
        rating: 5,
        text: "Celebrated our anniversary here. They arranged a special table with candles. Unforgettable evening!",
        source: "TripAdvisor"
    }
];

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>(mockReviews);

    useEffect(() => {
        if (!supabase) return;
        const fetchTestimonials = async () => {
            const { data } = await supabase
                .from('testimonials')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(3);

            if (data && data.length > 0) {
                setTestimonials(data);
            }
        };
        fetchTestimonials();
    }, []);
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
            <div className="max-w-6xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-amber-500 font-bold mb-6 hover:bg-slate-700 transition-colors cursor-default">
                        <Star size={16} fill="currentColor" />
                        <span>4.8/5 Average Rating</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-100 mb-6">What Our <span className="text-amber-500">Guests Say</span></h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((review: any, idx: number) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:bg-slate-800 hover:border-amber-500/30 transition-all text-left group"
                        >
                            <div className="flex gap-1 text-amber-500 mb-6">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                            </div>
                            <p className="text-slate-300 italic mb-6 leading-relaxed">"{review.message || review.text}"</p>
                            <div className="flex justify-between items-center border-t border-slate-700 pt-6">
                                <span className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors">{review.name}</span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    via {review.source}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
