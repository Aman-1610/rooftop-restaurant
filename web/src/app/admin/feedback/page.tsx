"use client";

import { useState, useEffect } from "react";
import { fetchFeedbacks } from "@/services/feedbackService";
import { Star, MessageCircle, User, Phone } from "lucide-react";

export default function AdminFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const data = await fetchFeedbacks();
            setFeedbacks(data);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-slate-500">Loading feedback...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Customer Feedback</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbacks.map((fb) => (
                    <div key={fb.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-1 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={i < fb.rating ? "currentColor" : "none"}
                                        className={i < fb.rating ? "" : "text-slate-300"}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-slate-400">{new Date(fb.created_at).toLocaleDateString()}</span>
                        </div>

                        <p className="text-slate-600 mb-6 italic">"{fb.message}"</p>

                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                <User size={14} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">{fb.customer_name || 'Anonymous'}</p>
                                {fb.contact_info && (
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <Phone size={10} /> {fb.contact_info}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {feedbacks.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No feedback received yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
