"use client";

import { useState, useEffect } from "react";
import { Save, Store, Shield, Bell, MapPin, Globe, Share2 } from "lucide-react";
import { toast } from "sonner";
import { fetchSettings, updateSettings } from "@/services/settingsService";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [settingsId, setSettingsId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        restaurantName: "",
        navbarTitle: "",
        address: "",
        phone: "",
        email: "",
        openingHours: "",
        tableCount: 10,
        notifications: true,
        deliveryFee: 50,
        mapLink: "",
        instagram: "",
        facebook: ""
    });

    useEffect(() => {
        async function loadSettings() {
            setLoading(true);
            try {
                const data = await fetchSettings();

                if (data) {
                    setSettingsId(data.id);
                    setFormData({
                        restaurantName: data.restaurant_name || "",
                        navbarTitle: data.navbar_title || data.restaurant_name || "",
                        address: data.address || "",
                        phone: data.phone || "",
                        email: data.email || "",
                        openingHours: data.opening_hours || "Daily: 4 PM - 11 PM",
                        tableCount: data.table_count || 10,
                        notifications: data.notifications_enabled ?? true,
                        deliveryFee: data.delivery_fee || 50,
                        mapLink: data.google_maps_link || "",
                        instagram: data.social_instagram || "",
                        facebook: data.social_facebook || ""
                    });
                } else {
                    setError("Settings not initialized. Please ensure the 'settings' table exists and has a row.");
                }
            } catch (err) {
                console.error("Error loading settings:", err);
                setError("Failed to load settings. Check console for details.");
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        // Handle number inputs specifically
        const finalValue = type === 'number' ? Number(value) : (type === 'checkbox' ? checked : value);

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            id: settingsId || undefined,
            restaurant_name: formData.restaurantName,
            navbar_title: formData.navbarTitle,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            opening_hours: formData.openingHours,
            table_count: formData.tableCount,
            delivery_fee: formData.deliveryFee,
            notifications_enabled: formData.notifications,
            google_maps_link: formData.mapLink,
            social_instagram: formData.instagram,
            social_facebook: formData.facebook
        };

        const { success, error } = await updateSettings(payload);

        if (success) {
            toast.success("Settings saved successfully!");
        } else {
            toast.error("Failed to save settings: " + error);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="max-w-4xl space-y-8 animate-pulse">
                <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
                <div className="bg-white p-8 rounded-2xl h-64"></div>
                <div className="bg-white p-8 rounded-2xl h-64"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <h1 className="text-3xl font-bold text-slate-800">Settings</h1>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">

                {/* General Settings */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                            <Store size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">General Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Restaurant Name</label>
                            <input
                                type="text"
                                name="restaurantName"
                                value={formData.restaurantName || ""}
                                onChange={handleChange}
                                placeholder="Full Legal Name"
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Navbar Title</label>
                            <input
                                type="text"
                                name="navbarTitle"
                                value={formData.navbarTitle || ""}
                                onChange={handleChange}
                                placeholder="Short Name for Header (e.g. ROOFTOP Dining)"
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                            <p className="text-xs text-slate-400 mt-1">First word will be amber, rest white.</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-500 text-sm font-bold mb-2">Opening Hours</label>
                            <input
                                type="text"
                                name="openingHours"
                                value={formData.openingHours || ""}
                                onChange={handleChange}
                                placeholder="e.g. Daily: 4 PM - 11 PM"
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Location & Contact */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <MapPin size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Location & Contact</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-slate-500 text-sm font-bold mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                                placeholder="Full address"
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                placeholder="+91 ..."
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                placeholder="contact@example.com"
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-500 text-sm font-bold mb-2">Google Maps Embed Link (Optional)</label>
                            <input
                                type="text"
                                name="mapLink"
                                value={formData.mapLink || ""}
                                onChange={handleChange}
                                placeholder="If empty, auto-generated from address"
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                            <p className="text-xs text-slate-400 mt-1">Paste the full embed URL from Google Maps (Share - Embed a map) if you want a specific custom view.</p>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Share2 size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Social Media</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Instagram URL</label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram || ""}
                                onChange={handleChange}
                                placeholder="https://instagram.com/..."
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Facebook URL</label>
                            <input
                                type="text"
                                name="facebook"
                                value={formData.facebook || ""}
                                onChange={handleChange}
                                placeholder="https://facebook.com/..."
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Operations */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Bell size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Operations</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Total Tables (for QR Generation)</label>
                            <input
                                type="number"
                                name="tableCount"
                                value={formData.tableCount || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                            <p className="text-xs text-slate-400 mt-1">Updates the number of generated QR codes.</p>
                        </div>
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Delivery Fee (₹)</label>
                            <input
                                type="number"
                                name="deliveryFee"
                                value={formData.deliveryFee || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <input
                                type="checkbox"
                                name="notifications"
                                checked={!!formData.notifications}
                                onChange={handleChange}
                                id="notif"
                                className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                            />
                            <label htmlFor="notif" className="text-slate-700 font-medium cursor-pointer">Enable Sound Notifications for New Orders</label>
                        </div>
                    </div>
                </div>

                {/* Security Placeholder */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 opacity-60">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Security</h2>
                    </div>
                    <p className="text-slate-500 text-sm">To change your password or email, please contact the system administrator.</p>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving || loading}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : (
                            <>
                                <Save size={20} /> Save Changes
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
