"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ManageTestimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({ name: "", text: "", rating: 5, source: "Google" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setTestimonials(data);
        setLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        if (!supabase) return;
        const { error } = await supabase.from('testimonials').insert([{
            name: newReview.name,
            message: newReview.text,
            rating: newReview.rating,
            source: newReview.source
        }]);

        if (error) {
            toast.error("Failed to add testimonial");
        } else {
            toast.success("Testimonial added");
            setNewReview({ name: "", text: "", rating: 5, source: "Google" });
            fetchTestimonials();
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: number) => {
        if (!supabase) return;
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) toast.error("Failed to delete");
        else {
            toast.success("Deleted");
            setTestimonials(prev => prev.filter(t => t.id !== id));
        }
    };

    return (
        <div className="max-w-6xl space-y-8 pb-12">
            <h1 className="text-3xl font-bold text-slate-800">Manage Testimonials</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <MessageSquare size={20} className="text-amber-500" /> Add Review
                    </h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-1">Customer Name</label>
                            <input
                                required
                                value={newReview.name}
                                onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:border-amber-500 transition-colors text-slate-900"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-1">Review Text</label>
                            <textarea
                                required
                                value={newReview.text}
                                onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border rounded-lg h-24 focus:outline-none focus:border-amber-500 transition-colors text-slate-900 textarea-dark"
                                placeholder="Great food..."
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-slate-600 mb-1">Rating</label>
                                <select
                                    value={newReview.rating}
                                    onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:border-amber-500 transition-colors text-slate-900 bg-white"
                                >
                                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r} className="text-slate-900">{r} Stars</option>)}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-slate-600 mb-1">Source</label>
                                <input
                                    value={newReview.source}
                                    onChange={e => setNewReview({ ...newReview, source: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:border-amber-500 transition-colors text-slate-900"
                                    placeholder="Google"
                                />
                            </div>
                        </div>
                        <button disabled={submitting} className="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold transition-colors disabled:opacity-70">
                            {submitting ? 'Adding...' : 'Add Testimonial'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? <p>Loading...</p> : testimonials.length === 0 ? (
                        <p className="text-slate-400 text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">No testimonials yet.</p>
                    ) : (
                        testimonials.map(t => (
                            <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-lg text-slate-800">{t.name}</h3>
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-bold">{t.source}</span>
                                        <div className="flex text-amber-500 ml-2">
                                            {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 italic">"{t.message}"</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                    title="Delete Review"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
