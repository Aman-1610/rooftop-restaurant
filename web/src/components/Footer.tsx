"use client";

import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
    const { settings } = useSettings();
    const name = settings?.restaurant_name || "ROOFTOP Dining";
    const address = settings?.address || "Brahmaputra Complex, Kahalgaon";
    const phone = settings?.phone || "+91 123 456 7890";
    const email = settings?.email || "hello@rooftoprestaurant.com";
    const openingHours = settings?.opening_hours || "Daily: 4 PM - 11 PM";
    const instagram = settings?.social_instagram || "#";
    const facebook = settings?.social_facebook || "#";

    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h3 className="text-2xl font-serif text-amber-500 mb-4">{name}</h3>
                    <p className="text-sm">
                        Experience the magic of evening dining with panoramic city views and authentic flavors.
                    </p>
                    <div className="mt-4 flex space-x-4 justify-center md:justify-start">
                        <Link href={instagram} target={instagram !== "#" ? "_blank" : undefined} className="text-xl hover:text-amber-400"><i className="fab fa-instagram"></i></Link>
                        <Link href={facebook} target={facebook !== "#" ? "_blank" : undefined} className="text-xl hover:text-amber-400"><i className="fab fa-facebook"></i></Link>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-bold text-slate-100 mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><Link href="/menu" className="hover:text-amber-400 transition-colors">Our Menu</Link></li>
                        <li><Link href="/reservations" className="hover:text-amber-400 transition-colors">Book a Table</Link></li>
                        <li><Link href="/gallery" className="hover:text-amber-400 transition-colors">Gallery</Link></li>
                        <li><Link href="/feedback" className="hover:text-amber-400 transition-colors">Feedback</Link></li>
                        <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-bold text-slate-100 mb-4">Contact & Hours</h4>
                    <ul className="space-y-2 text-sm">
                        <li>📍 {address}</li>
                        <li>📞 <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-amber-400">{phone}</a></li>
                        <li>✉️ <a href={`mailto:${email}`} className="hover:text-amber-400">{email}</a></li>
                        <li className="mt-4 text-amber-500 font-semibold">{openingHours}</li>
                    </ul>
                </div>
            </div>

            <div className="text-center mt-12 pt-8 border-t border-slate-800 text-xs">
                &copy; {new Date().getFullYear()} {name}. All rights reserved.
            </div>
        </footer>
    );
}
