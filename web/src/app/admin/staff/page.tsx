"use client";

import { useState, useEffect } from "react";
import { UserPlus, Shield, User, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ManageStaffPage() {
    const [creating, setCreating] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [setupLoading, setSetupLoading] = useState(false);

    const handleSetupAdmin = async () => {
        setSetupLoading(true);
        try {
            const response = await fetch('/api/admin/setup-admin', { method: 'POST' });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error);

            toast.success("You are now an Admin! Reloading...", { duration: 2000 });
            setTimeout(() => window.location.reload(), 1500);

        } catch (err: any) {
            toast.error("Setup failed: " + err.message);
        } finally {
            setSetupLoading(false);
        }
    };

    const fetchStaff = async () => {
        setLoading(true);
        if (!supabase) return;

        const { data, error } = await supabase
            .from('user_roles')
            .select('*')
            .eq('role', 'chef')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching staff:', error);
            // Don't show error if it's RLS or table missing initially, just show empty
        } else if (data) {
            setStaff(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleCreateChef = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            const response = await fetch('/api/admin/create-chef', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create chef');
            }

            toast.success("Chef created successfully!");
            setEmail("");
            setPassword("");
            setName("");
            fetchStaff();

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="max-w-6xl space-y-8 pb-12">
            <h1 className="text-3xl font-bold text-slate-800">Manage Kitchen Staff</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                            <UserPlus size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Add New Chef</h2>
                    </div>

                    <form onSubmit={handleCreateChef} className="space-y-6">
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Chef Name"
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="chef@restaurant.com"
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-sm font-bold mb-2">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-amber-500 outline-none transition-colors"
                            />
                            <p className="text-xs text-slate-400 mt-1">Must be at least 6 characters.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={creating}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {creating ? <span className="animate-pulse">Creating Account...</span> : 'Create Account'}
                        </button>
                    </form>
                </div>

                {/* List Staff */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <User size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Existing Chefs</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-sm uppercase font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-lg">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    {/* <th className="px-6 py-4 rounded-r-lg">Actions</th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                            Loading staff list...
                                        </td>
                                    </tr>
                                ) : staff.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                            No chefs found. Create an account to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    staff.map((member) => (
                                        <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-700">{member.name || "Unknown"}</td>
                                            <td className="px-6 py-4 text-slate-600 font-mono text-sm">{member.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                                    {member.role}
                                                </span>
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                <button className="text-slate-400 hover:text-red-500 transition-colors" title="Delete functionality not implemented yet">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td> */}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-xs text-slate-400 italic">
                        Note: To be visible here, users must have a record in the 'user_roles' table.
                    </p>

                    {staff.length === 0 && (
                        <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-amber-100 rounded-full text-amber-600 mt-1">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-amber-900 mb-1">First Time Setup?</h3>
                                    <p className="text-sm text-amber-700 mb-4">
                                        You are seeing an empty list because the admin role hasn't been assigned to your account yet.
                                        Click below to grant yourself admin access.
                                    </p>
                                    <button
                                        onClick={handleSetupAdmin}
                                        disabled={setupLoading}
                                        className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {setupLoading ? 'Setting up...' : 'Grant Me Admin Access'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
