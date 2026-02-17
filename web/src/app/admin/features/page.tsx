"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Utensils, GlassWater, View, Wifi, Music, Truck, Star, Heart, Clock, MapPin, Phone, Shield } from "lucide-react";
import { toast } from "sonner";
import { Feature, fetchFeatures, addFeature, updateFeature, deleteFeature } from "@/services/featuresService";

const iconOptions = [
    { name: "Utensils", icon: Utensils },
    { name: "GlassWater", icon: GlassWater },
    { name: "View", icon: View },
    { name: "Wifi", icon: Wifi },
    { name: "Music", icon: Music },
    { name: "Truck", icon: Truck },
    { name: "Star", icon: Star },
    { name: "Heart", icon: Heart },
    { name: "Clock", icon: Clock },
    { name: "MapPin", icon: MapPin },
    { name: "Phone", icon: Phone },
    { name: "Shield", icon: Shield }
];

export default function ManageFeatures() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Feature | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("Star");
    const [order, setOrder] = useState(0);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchFeatures();
        setFeatures(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editing) {
            const { success, error } = await updateFeature(editing.id, { title, description, icon, display_order: order });
            if (success) {
                toast.success("Feature updated successfully");
                setEditing(null);
                resetForm();
                loadData();
            } else {
                toast.error("Failed to update feature: " + error);
            }
        } else {
            const { success, error } = await addFeature({ title, description, icon, display_order: order });
            if (success) {
                toast.success("Feature added successfully");
                resetForm();
                loadData();
            } else {
                toast.error("Failed to add feature: " + error);
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this feature?")) return;
        const { success, error } = await deleteFeature(id);
        if (success) {
            toast.success("Feature deleted");
            loadData();
        } else {
            toast.error("Failed to delete feature: " + error);
        }
    };

    const handleEdit = (feature: Feature) => {
        setEditing(feature);
        setTitle(feature.title);
        setDescription(feature.description);
        setIcon(feature.icon);
        setOrder(feature.display_order);
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setIcon("Star");
        setOrder(features.length + 1);
        setEditing(null);
    };

    const SelectedIcon = iconOptions.find(opt => opt.name === icon)?.icon || Star;

    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <h1 className="text-3xl font-bold text-slate-800">Manage Features</h1>

            {/* Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        {editing ? <Edit size={20} /> : <Plus size={20} />}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{editing ? "Edit Feature" : "Add New Feature"}</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-1">Title</label>
                            <input
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:border-amber-500 text-slate-900"
                                placeholder="e.g. Free Wifi"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-1">Display Order</label>
                            <input
                                type="number"
                                required
                                value={order}
                                onChange={e => setOrder(Number(e.target.value))}
                                className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:border-amber-500 text-slate-900"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-600 mb-1">Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:border-amber-500 h-24 resize-none text-slate-900"
                                placeholder="Brief description of the feature..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-600 mb-2">Select Icon</label>
                            <div className="flex flex-wrap gap-2">
                                {iconOptions.map(opt => (
                                    <button
                                        key={opt.name}
                                        type="button"
                                        onClick={() => setIcon(opt.name)}
                                        className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 min-w-[80px] ${icon === opt.name
                                            ? "bg-amber-500 text-white border-amber-600 shadow-md transform scale-105"
                                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                            }`}
                                    >
                                        <opt.icon size={20} />
                                        <span className="text-xs font-medium">{opt.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        {editing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 text-slate-500 hover:text-slate-700 font-bold transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="px-8 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold transition-colors shadow-lg hover:shadow-xl">
                            {editing ? "Update Feature" : "Add Feature"}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? <p>Loading features...</p> : features.map((feature) => {
                    const FeatureIcon = iconOptions.find(opt => opt.name === feature.icon)?.icon || Star;
                    return (
                        <div key={feature.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4 group hover:shadow-md transition-all">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-full mt-1">
                                <FeatureIcon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg">{feature.title}</h3>
                                <p className="text-slate-500 text-sm mb-4 leading-relaxed">{feature.description}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(feature)}
                                        className="text-xs font-bold text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                                    >
                                        <Edit size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(feature.id)}
                                        className="text-xs font-bold text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                                    >
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            </div>
                            <div className="text-xs font-bold text-slate-300 bg-slate-100 px-2 py-1 rounded">
                                #{feature.display_order}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
