"use client";

import { useState, useEffect } from "react";
import { fetchOrders, updateOrderStatus } from "@/services/orderService";
import { Clock, CheckCircle, ChefHat } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function KitchenDisplay() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const data = await fetchOrders();
            // Filter only Pending and Preparing orders for the kitchen
            const activeOrders = data.filter((o: any) => o.status === 'Pending' || o.status === 'Preparing');

            // Sort by ID or time (usually older first)
            activeOrders.sort((a: any, b: any) => a.id - b.id);

            setOrders(activeOrders);
            setLoading(false);
        }
        loadData();

        // Realtime subscription for updates
        const channel = supabase
            .channel('kitchen-updates')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                () => setLastUpdate(Date.now())
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                () => setLastUpdate(Date.now())
            )
            .subscribe();

        // Auto-refresh fallback
        const interval = setInterval(() => {
            setLastUpdate(Date.now());
        }, 30000);

        return () => {
            clearInterval(interval);
            supabase.removeChannel(channel);
        };
    }, [lastUpdate]);

    const handleStatusUpdate = async (id: number, status: string) => {
        const { success } = await updateOrderStatus(id, status);
        if (success) {
            setLastUpdate(Date.now());
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o).filter(o => status !== 'Ready')); // Remove if ready? Or keep?
            // Usually Kitchen Display removes "Ready" orders or moves them to separate list.
            // Current user code showed "Mark Ready" button, logic implies it stays until refreshed or filtered out?
            // The filter condition is `o.status === 'Pending' || o.status === 'Preparing'`.
            // So if I set to 'Ready', it should disappear from THIS list on re-fetch.
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-500">
                <div className="flex flex-col items-center gap-4">
                    <ChefHat className="animate-bounce" size={48} />
                    <p className="text-xl font-bold">Loading Kitchen Display...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-slate-900 text-slate-100">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500 rounded-full text-slate-900">
                        <ChefHat size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-amber-500">Kitchen Display System</h1>
                        <p className="text-slate-400">Live feed of active orders</p>
                    </div>
                </div>
                <button
                    onClick={() => setLastUpdate(Date.now())}
                    className="px-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-bold"
                >
                    Refresh Now
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {orders.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-slate-800/50 rounded-3xl border border-slate-800 dashed">
                        <ChefHat size={64} className="mx-auto text-slate-700 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-500">All caught up!</h2>
                        <p className="text-slate-600">No pending orders in the queue.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className={`rounded-2xl overflow-hidden border-2 shadow-xl flex flex-col ${order.status === 'Pending'
                                ? 'bg-slate-800 border-amber-500/50 shadow-amber-900/20'
                                : 'bg-slate-800 border-blue-500/50 shadow-blue-900/20'
                                }`}
                        >
                            {/* Header */}
                            <div className={`p-4 flex justify-between items-center ${order.status === 'Pending' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                                }`}>
                                <span className="font-mono text-2xl font-black text-slate-100">#{order.id}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'Pending' ? 'bg-amber-500 text-slate-900 animate-pulse' : 'bg-blue-500 text-white'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Timer */}
                            <div className="px-4 py-2 bg-slate-900/50 flex items-center gap-2 text-sm text-slate-400 border-b border-slate-700">
                                <Clock size={14} />
                                <span>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="ml-auto font-mono text-xs opacity-50">
                                    {Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000)}m ago
                                </span>
                            </div>

                            {/* Items */}
                            <div className="p-4 flex-1 overflow-y-auto max-h-[400px]">
                                <ul className="space-y-4">
                                    {/* Handle potentially nested or structure diffs if any. 
                                        Assuming order_items structure from previous code. */}
                                    {order.order_items && order.order_items.map((item: any) => (
                                        <li key={item.id} className="flex gap-3 text-lg">
                                            <span className="font-bold text-slate-900 bg-slate-200 w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0">
                                                {item.quantity}
                                            </span>
                                            <span className="font-medium text-slate-200 leading-snug">
                                                {item.menu_item_name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                {order.notes && (
                                    <div className="mt-6 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                                        <p className="text-red-300 text-sm font-bold uppercase mb-1">Kitchen Note:</p>
                                        <p className="text-red-100 italic">{order.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-4 bg-slate-900/50 border-t border-slate-700 mt-auto">
                                <div className="text-xs text-slate-500 mb-2 font-mono">
                                    {order.order_type === 'Dine-in' ? `Table: ${order.table_no}` : `Delivery: ${order.customer_name || 'Guest'}`}
                                </div>
                                {order.status === 'Pending' ? (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'Preparing')}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-blue-900/50"
                                    >
                                        Start Preparing
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'Ready')}
                                        className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-green-900/50 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={24} /> Mark Ready
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
