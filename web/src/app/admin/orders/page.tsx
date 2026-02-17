"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchOrders, updateOrderStatus } from "@/services/orderService";
import { Clock, CheckCircle, XCircle, Truck, MapPin, Phone, Printer, ExternalLink } from "lucide-react";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const data = await fetchOrders();
            setOrders(data);
            setLoading(false);
        }
        loadData();
    }, [lastUpdate]);

    const handleStatusUpdate = async (id: number, status: string) => {
        const { success } = await updateOrderStatus(id, status);
        if (success) setLastUpdate(Date.now());
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
            case "Preparing": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case "Ready": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
            case "Delivered": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "Cancelled": return "text-red-500 bg-red-500/10 border-red-500/20";
            default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
        }
    };

    if (loading && orders.length === 0) {
        return <div className="p-8 text-slate-500">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-800">Live Orders</h1>
                    <p className="text-slate-500">Manage incoming delivery and pickup orders</p>
                </div>
                <button
                    onClick={() => setLastUpdate(Date.now())}
                    className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Truck size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500">No active orders right now.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            {/* Order Header */}
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono font-bold text-lg text-slate-700">#{order.id}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <span className="text-sm text-slate-500 flex items-center gap-1">
                                        <Clock size={14} />
                                        {new Date(order.created_at).toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                        <>
                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'Preparing')}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
                                                >
                                                    Accept & Prepare
                                                </button>
                                            )}
                                            {order.status === 'Preparing' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'Ready')}
                                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition-colors"
                                                >
                                                    Mark Ready
                                                </button>
                                            )}
                                            {order.status === 'Ready' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors"
                                                >
                                                    Complete Delivery
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure checking to cancel this order?')) handleStatusUpdate(order.id, 'Cancelled');
                                                }}
                                                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </>
                                    )}
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex items-center gap-2"
                                        title="View Details & Print"
                                    >
                                        <Printer size={20} />
                                    </Link>
                                </div>
                            </div>

                            {/* Order Body */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Customer Details */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Customer</h3>
                                    <div>
                                        <p className="font-bold text-slate-700">{order.customer_name}</p>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                            <Phone size={14} />
                                            <a href={`tel:${order.phone}`} className="hover:text-blue-600">{order.phone}</a>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-start gap-2 text-slate-600 text-sm">
                                            <MapPin size={14} className="mt-1 flex-shrink-0" />
                                            <p>{order.address}</p>
                                        </div>
                                        {order.notes && (
                                            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                                                <span className="font-bold">Note:</span> {order.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="md:col-span-2 space-y-4">
                                    <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Order Items</h3>
                                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                        {order.order_items && order.order_items.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-200 last:border-0 pb-3 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-slate-800 w-6 h-6 flex items-center justify-center bg-white rounded-full border border-slate-200">
                                                        {item.quantity}x
                                                    </span>
                                                    <span className="text-slate-700">{item.menu_item_name}</span>
                                                </div>
                                                <span className="font-medium text-slate-600">₹{item.price_at_time * item.quantity}</span>
                                            </div>
                                        ))}
                                        <div className="pt-3 flex justify-between items-center border-t border-slate-200 mt-2">
                                            <span className="font-bold text-slate-800">Total Amount</span>
                                            <span className="text-xl font-bold text-amber-600">₹{order.total_amount}</span>
                                        </div>
                                        <div className="text-right text-xs text-slate-400">
                                            Payment: {order.payment_method}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
