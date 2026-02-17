"use client";

import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function Contact() {
    const { settings } = useSettings();
    const address = settings?.address || "Brahmaputra Complex, Satkar Chowk, Kahalgaon, Bihar 813203";
    const phone = settings?.phone || "+91 123 456 7890";
    const openingHours = settings?.opening_hours || "Daily: 4 PM - 11 PM";

    // Use custom link if provided, otherwise auto-generate from address
    const mapSrc = settings?.google_maps_link || `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-100">

                {/* Info Column */}
                <div className="space-y-8 flex flex-col justify-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Visit <span className="text-amber-500">Us</span></h2>

                    <div className="flex items-start gap-6 group">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors shadow-lg">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Location</h3>
                            <p className="text-slate-400 whitespace-pre-line">{address}</p>
                            <a href="https://maps.google.com" target="_blank" className="text-amber-500 text-sm font-bold mt-2 inline-block hover:underline">Get Directions →</a>
                        </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors shadow-lg">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Opening Hours</h3>
                            <p className="text-slate-400 whitespace-pre-line">{openingHours}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors shadow-lg">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Book a Table</h3>
                            <p className="text-slate-400">{phone}</p>
                            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-amber-500 text-sm font-bold mt-2 inline-block hover:underline">Call Now →</a>
                        </div>
                    </div>
                </div>

                {/* Map Column */}
                <div className="h-[400px] md:h-full min-h-[400px] bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative group">
                    <iframe
                        src={mapSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        className="group-hover:opacity-90 transition-opacity grayscale hover:grayscale-0 duration-700"
                    ></iframe>
                    <div className="absolute top-4 right-4 bg-white/90 text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg truncate max-w-[200px]">
                        📍 {address.split(',')[0]}
                    </div>
                </div>
            </div>
        </section>
    );
}
