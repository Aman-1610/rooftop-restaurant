"use client";

import { createReservation } from "@/services/menuService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Calendar, Clock, User, Phone, Mail, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ReservationsPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        guests: 2
    });

    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Save to Database
        const reservationData = {
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_email: formData.email,
            reservation_date: formData.date,
            reservation_time: formData.time,
            guests: Number(formData.guests),
            status: 'Pending'
        };

        const { success } = await createReservation(reservationData);

        if (!success) {
            alert("Something went wrong saving your booking. Please try again or call use directly.");
            return;
        }

        // 2. WhatsApp Integration (keep as fallback/notification)
        const phone = "919999999999";
        const message = `Hello, I'd like to book a table at The Rooftop Restaurant.
    
    Name: ${formData.name}
    Date: ${formData.date}
    Time: ${formData.time}
    Guests: ${formData.guests}
    Phone: ${formData.phone}
    Email: ${formData.email}`;

        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        // window.open(whatsappUrl, '_blank');

        setSuccess(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <main className="min-h-screen bg-slate-900 text-slate-50 font-sans">
            <Header />

            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/50 to-slate-900" />
                </div>
                <div className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-amber-500 mb-4 tracking-tight drop-shadow-xl">
                        {t('res_title')}
                    </h1>
                    <p className="text-xl text-slate-300">{t('res_subtitle')}</p>
                </div>
            </section>

            <section className="py-20 px-4 flex justify-center items-center">
                <div className="w-full max-w-4xl bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-700">

                    {/* Success Message */}
                    {success ? (
                        <div className="text-center py-20 flex flex-col items-center animate-pulse">
                            <CheckCircle size={64} className="text-green-500 mb-6" />
                            <h2 className="text-3xl font-serif text-slate-100 font-bold mb-4">Reservation Confirmed!</h2>
                            <p className="text-slate-400">We'll see you on {formData.date} at {formData.time} PM.</p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="mt-8 px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-200 transition-colors"
                            >
                                Book Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                {/* Date & Time */}
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <label className="block text-amber-500 text-sm font-bold mb-2 uppercase tracking-wide">{t('form_date')}</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                                            <input
                                                type="date"
                                                name="date"
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-slate-900 rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-200 transition-all cursor-pointer"
                                                onChange={handleChange}
                                                value={formData.date}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="block text-amber-500 text-sm font-bold mb-2 uppercase tracking-wide">{t('form_time')}</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                                            <input
                                                type="time"
                                                name="time"
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-slate-900 rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-200 transition-all cursor-pointer"
                                                onChange={handleChange}
                                                value={formData.time}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="block text-amber-500 text-sm font-bold mb-2 uppercase tracking-wide">{t('form_guests')}</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                                            <select
                                                name="guests"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-900 rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-200 transition-all cursor-pointer appearance-none"
                                                onChange={handleChange}
                                                value={formData.guests}
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">▼</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <label className="block text-amber-500 text-sm font-bold mb-2 uppercase tracking-wide">{t('form_name')}</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="John Doe"
                                                required
                                                className="w-full px-6 py-4 bg-slate-900 rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-200 transition-all placeholder:text-slate-600"
                                                onChange={handleChange}
                                                value={formData.name}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="block text-amber-500 text-sm font-bold mb-2 uppercase tracking-wide">{t('form_phone')}</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="+91 99999 99999"
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-slate-900 rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-200 transition-all placeholder:text-slate-600"
                                                onChange={handleChange}
                                                value={formData.phone}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="block text-amber-500 text-sm font-bold mb-2 uppercase tracking-wide">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="john@example.com"
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-slate-900 rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-200 transition-all placeholder:text-slate-600"
                                                onChange={handleChange}
                                                value={formData.email}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 font-bold text-xl rounded-xl shadow-lg shadow-amber-500/30 transform hover:scale-[1.02] transition-all duration-300"
                            >
                                {t('btn_reserve')}
                            </button>

// ...
                            <p className="text-center text-slate-500 text-sm mt-4">
                                By booking, you agree to our terms. Cancellations accepted up to 2 hours prior.
                            </p>
                        </form>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
