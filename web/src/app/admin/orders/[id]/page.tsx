"use client";

import { useEffect, useState, use } from "react";
import { fetchOrderById, updateOrderStatus } from "@/services/orderService";
import { ArrowLeft, Printer, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadOrder();
        }
    }, [id]);

    const loadOrder = async () => {
        setLoading(true);
        const data = await fetchOrderById(Number(id));
        setOrder(data);
        setLoading(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleStatusUpdate = async (status: string) => {
        if (!order) return;
        const { success } = await updateOrderStatus(order.id, status);
        if (success) {
            loadOrder();
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading order details...</div>;
    }

    if (!order) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">Order not found.</p>
                <Link href="/admin/orders" className="text-blue-600 hover:underline">
                    Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            {/* Header / Actions */}
            <div className="flex justify-between items-center print:hidden">
                <Link href="/admin/orders" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft size={20} /> Back to Orders
                </Link>
                <div className="flex gap-3">
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-amber-500"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        <Printer size={18} /> Print Receipt
                    </button>
                </div>
            </div>

            {/* Printable Receipt Area */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
                {/* Receipt Header */}
                <div className="text-center border-b border-slate-100 pb-6 mb-6">
                    <h1 className="text-2xl font-serif font-bold text-slate-800">The Rooftop Restaurant</h1>
                    <p className="text-slate-500 text-sm">Fine Dining & Drinks</p>
                    <p className="text-slate-400 text-xs mt-1">123 Skyline Ave, City Center</p>
                    <div className="mt-4 inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-mono text-slate-600">
                        Order #{order.id}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                    <div>
                        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-2">Customer</h3>
                        <p className="font-bold text-slate-800 text-lg">{order.customer_name}</p>
                        <p className="flex items-center gap-2 text-slate-600 mt-1">
                            <Phone size={14} /> {order.phone}
                        </p>
                        <p className="flex items-start gap-2 text-slate-600 mt-1">
                            <MapPin size={14} className="mt-1 flex-shrink-0" /> {order.address}
                        </p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-2">Order Details</h3>
                        <p className="text-slate-600 flex items-center justify-end gap-2">
                            {new Date(order.created_at).toLocaleDateString()} <Clock size={14} />
                        </p>
                        <p className="text-slate-600">{new Date(order.created_at).toLocaleTimeString()}</p>
                        <p className={`mt-2 font-bold ${order.payment_method === 'COD' ? 'text-orange-600' : 'text-green-600'
                            }`}>
                            {order.payment_method}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">Status: {order.status}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-left text-slate-400 font-medium">
                                <th className="py-2 w-16">Qty</th>
                                <th className="py-2">Item</th>
                                <th className="py-2 text-right">Price</th>
                                <th className="py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {order.order_items && order.order_items.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="py-3 font-bold text-slate-800">{item.quantity}x</td>
                                    <td className="py-3 text-slate-700">{item.menu_item_name}</td>
                                    <td className="py-3 text-right text-slate-500">₹{item.price_at_time}</td>
                                    <td className="py-3 text-right font-medium text-slate-800">
                                        ₹{item.price_at_time * item.quantity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="border-t border-slate-200 pt-6 space-y-2">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>₹{order.total_amount}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Tax (5%)</span>
                        <span>₹{Math.round(order.total_amount * 0.05)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold text-slate-800 pt-4 border-t border-dashed border-slate-200 mt-4">
                        <span>Grand Total</span>
                        <span>₹{Math.round(order.total_amount * 1.05)}</span>
                    </div>
                </div>

                {/* Footer Notes */}
                {order.notes && (
                    <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                        <span className="font-bold">Instructions:</span> {order.notes}
                    </div>
                )}

                <div className="mt-12 text-center text-slate-400 text-xs print:mt-20">
                    <p>Thank you for dining with us!</p>
                    <p className="mt-1">www.rooftoprestaurant.com</p>
                </div>
            </div>
        </div>
    );
}
