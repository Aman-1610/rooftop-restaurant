"use client";

import { addMenuItem } from "@/services/menuService";
import { useState } from "react";
import Image from "next/image";

export default function AddMenuItem() {
    const [formData, setFormData] = useState({
        name: "",
        category: "Starters",
        price: "",
        description: "",
        image_url: "", // Changed from 'image'
    });

    const categories = ["Starters", "Main Course", "Drinks", "Desserts"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare data
        const itemData = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            description: formData.description,
            image_url: formData.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200",
            available: true
        };

        const { success, error } = await addMenuItem(itemData);

        if (success) {
            alert("Item Added Successfully!");
            window.location.href = "/admin/menu";
        } else {
            alert("Failed to add item: " + error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 font-serif">Add New Menu Item</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wide">Item Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder-slate-400 font-medium text-slate-800"
                        placeholder="e.g. Tandoori Chicken"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wide">Category</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 font-medium"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wide">Price (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-800"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wide">Description</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-slate-600 font-medium placeholder-slate-400"
                        placeholder="Describe the dish..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wide">Image</label>
                    <div className="space-y-4">
                        {/* URL Input */}
                        <div className="flex gap-2">
                            <input
                                type="url"
                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-slate-600 font-medium placeholder-slate-400"
                                placeholder="https://example.com/image.jpg"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                        </div>

                        {/* Preview */}
                        {formData.image_url && (
                            <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-slate-200 border-dashed bg-slate-50 group">
                                <Image
                                    src={formData.image_url}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        // Hide broken images or show placeholder
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+URL';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image_url: "" })}
                                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove Image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        )}
                        {!formData.image_url && (
                            <div className="w-full h-32 rounded-xl border-2 border-slate-200 border-dashed bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                                <span className="text-sm">Image Preview will appear here</span>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Enter a direct image URL (e.g., from Unsplash or your hosting).</p>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        className="px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/20 transform hover:scale-[1.02] transition-all"
                    >
                        Save Item
                    </button>
                </div>
            </form>
        </div>
    );
}
