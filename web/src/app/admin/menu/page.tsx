"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// ... imports
import { fetchAllMenuItems, updateMenuItem, deleteMenuItem } from "@/services/menuService";
import { useEffect } from "react";

export default function MenuManager() {
    const [items, setItems] = useState<any[]>([]);
    const [filter, setFilter] = useState("All");
    const [lastUpdate, setLastUpdate] = useState(Date.now()); // Trigger for re-fetch

    useEffect(() => {
        async function loadData() {
            const data = await fetchAllMenuItems();
            setItems(data || []);
        }
        loadData();
    }, [lastUpdate]);

    const categories = ["All", "Starters", "Main Course", "Drinks", "Desserts"];

    // Toggle Availability
    const toggleAvailability = async (id: number, currentStatus: boolean) => {
        const { success } = await updateMenuItem(id, { available: !currentStatus });
        if (success) setLastUpdate(Date.now());
    };

    // Toggle Featured
    const toggleFeatured = async (id: number, currentStatus: boolean) => {
        const { success } = await updateMenuItem(id, { is_featured: !currentStatus });
        if (success) setLastUpdate(Date.now());
    };

    // Delete Item
    const deleteItem = async (id: number) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const { success } = await deleteMenuItem(id);
            if (success) setLastUpdate(Date.now());
        }
    };

    const filteredItems = filter === "All" ? items : items.filter(item => item.category === filter);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Menu Manager</h1>
                <Link href="/admin/menu/add" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
                    <Plus size={20} />
                    Add New Item
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 pb-4 overflow-x-auto">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat
                            ? "bg-slate-800 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Items List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3 font-medium">Image</th>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Category</th>
                            <th className="px-6 py-3 font-medium">Price</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Featured</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredItems.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-slate-100">
                                        <Image src={item.image_url || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                                <td className="px-6 py-4 text-slate-500">{item.category}</td>
                                <td className="px-6 py-4 font-bold text-amber-600">₹{item.price}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleAvailability(item.id, item.available)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border ${item.available
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-red-100 text-red-700 border-red-200"
                                            }`}
                                    >
                                        {item.available ? "Available" : "Out of Stock"}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleFeatured(item.id, item.is_featured)}
                                        className={`p-2 rounded-lg transition-colors ${item.is_featured
                                            ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                                            : "text-slate-300 hover:text-amber-500 hover:bg-amber-50"
                                            }`}
                                        title={item.is_featured ? "Remove from homepage" : "Feature on homepage"}
                                    >
                                        <Star size={18} fill={item.is_featured ? "currentColor" : "none"} />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredItems.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No items found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}
