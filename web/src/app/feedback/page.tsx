"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Star, Send, MessageSquare } from "lucide-react";
import { submitFeedback } from "@/services/feedbackService";

export default function FeedbackPage() {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        customer_name: "",
        contact_info: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            alert("Please select a rating!");
            return;
        }

        const { success } = await submitFeedback({
            rating,
            customer_name: formData.customer_name,
            contact_info: formData.contact_info,
            message: formData.message
        });

        if (success) setSubmitted(true);
        else alert("Something went wrong. Please try again.");
    };

    return (
        <main className="min-h-screen bg-slate-900 text-slate-50 font-sans">
            <Header />

            <section className="py-20 px-4 flex justify-center items-center min-h-[80vh]">
                <div className="max-w-xl w-full bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-700">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-amber-500/20 rounded-full mb-4">
                            <MessageSquare size={32} className="text-amber-500" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-slate-100">We Value Your Feedback</h1>
                        <p className="text-slate-400 mt-2">How was your experience with us?</p>
                    </div>

                    {submitted ? (
                        <div className="text-center py-12 animate-pulse">
                            <h2 className="text-2xl font-bold text-green-500 mb-2">Thank You!</h2>
                            <p className="text-slate-400">Your feedback helps us serve you better.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Star Rating */}
                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            size={40}
                                            fill={(hoverRating || rating) >= star ? "#fbbf24" : "none"}
                                            className={(hoverRating || rating) >= star ? "text-amber-400" : "text-slate-600"}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wide">Name (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:border-amber-500 outline-none text-slate-200"
                                    placeholder="Your Name"
                                    value={formData.customer_name}
                                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wide">Contact Info (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:border-amber-500 outline-none text-slate-200"
                                    placeholder="Phone or Email"
                                    value={formData.contact_info}
                                    onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wide">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:border-amber-500 outline-none text-slate-200"
                                    placeholder="Tell us what you liked or how we can improve..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <Send size={18} /> Submit Feedback
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
