"use client";

import { motion } from "framer-motion";
import { Utensils, GlassWater, View } from "lucide-react";

const features = [
    {
        icon: <GlassWater size={64} className="text-amber-500" />,
        title: "Signature Cocktails",
        description: "Handcrafted mocktails and beverages designed to perfectly complement your evening under the stars."
    },
    {
        icon: <Utensils size={64} className="text-amber-500" />,
        title: "Authentic Cuisine",
        description: "A fusion of local flavors and modern culinary techniques, sourcing the freshest ingredients daily."
    },
    {
        icon: <View size={64} className="text-amber-500" />,
        title: "Panoramic Views",
        description: "The perfect sunset spot in Kahalgaon, offering breathtaking views of the city skyline and river."
    }
];

export default function Features() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 overflow-hidden">
            <div className="max-w-7xl mx-auto text-center">
                <motion.h2
                    className="text-3xl md:text-5xl font-serif text-slate-100 mb-12 tracking-wide font-bold"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Why Dine <span className="text-amber-500">With Us?</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all hover:-translate-y-2 group backdrop-blur-sm"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                        >
                            <div className="w-20 h-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors shadow-lg shadow-black/30">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-serif mb-4 text-amber-100 group-hover:text-amber-400 transition-colors">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
