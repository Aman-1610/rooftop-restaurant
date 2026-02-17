"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Utensils, Calendar } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";

export default function Hero() {
    const { t } = useLanguage();
    const { settings } = useSettings();

    const heroTitle = settings?.hero_title || t('hero_title');
    const heroSubtitle = settings?.hero_subtitle || t('hero_subtitle');
    const heroDesc = settings?.hero_description || t('footer_desc');
    const heroCta = settings?.hero_cta_text || t('cta_book');
    const bgImage = settings?.hero_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop";

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={bgImage}
                    alt="Rooftop Restaurant Ambiance"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90" />
            </div>

            {/* Hero Content */}
            <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-amber-400 font-serif text-xl md:text-2xl mb-4 tracking-widest uppercase">
                        {heroSubtitle}
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif mb-6 leading-tight text-white drop-shadow-2xl">
                        {heroTitle.split(' ').slice(0, -1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{heroTitle.split(' ').slice(-1)}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        {heroDesc}
                    </p>
                </motion.div>

                <motion.div
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Link href="/reservations" className="group relative px-8 py-4 bg-amber-500 text-slate-900 font-bold rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Calendar size={20} />
                            {heroCta}
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>

                    <Link href="/menu" className="group px-8 py-4 border border-slate-400 text-slate-100 font-semibold rounded-full hover:border-amber-400 hover:text-amber-400 transition-all hover:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center gap-2">
                        <Utensils size={20} />
                        {t('cta_menu')}
                    </Link>

                    <a href={`tel:${settings?.phone || "+911234567890"}`} className="group px-8 py-4 bg-slate-800 text-slate-200 font-semibold rounded-full hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500">
                        <span>📞</span>
                        Call Now
                    </a>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-slate-400"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-3 bg-amber-500 rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
