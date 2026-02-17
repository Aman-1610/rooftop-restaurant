"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearCart } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, CheckCircle, Download, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { createOrder, Order } from "@/services/orderService";
import { fetchSettings } from "@/services/settingsService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CheckoutPage() {
    const { items, orderType, tableNumber } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        notes: ""
    });

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [settingsDeliveryFee, setSettingsDeliveryFee] = useState(50);

    useEffect(() => {
        async function loadFee() {
            const settings = await fetchSettings();
            if (settings?.delivery_fee !== undefined) {
                setSettingsDeliveryFee(settings.delivery_fee);
            }
        }
        loadFee();
    }, []);

    const [receiptData, setReceiptData] = useState<{
        items: any[];
        total: number;
        subtotal: number;
        deliveryFee: number;
        orderType: string;
        tableNumber?: string;
        customerName: string;
    } | null>(null);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = orderType === 'Dine-in' ? 0 : settingsDeliveryFee;
    const total = subtotal + deliveryFee;

    // Redirect empty cart
    useEffect(() => {
        if (items.length === 0 && !success) {
            router.push("/menu");
        }
    }, [items, success, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const orderData: Order = {
            customer_name: formData.name || (orderType === 'Dine-in' ? `Table ${tableNumber}` : 'Guest'),
            phone: formData.phone || (orderType === 'Dine-in' ? '-' : ''),
            address: formData.address || (orderType === 'Dine-in' ? `Table ${tableNumber}` : ''),
            notes: formData.notes,
            total_amount: total,
            status: 'Pending',
            payment_method: 'COD',
            order_type: orderType,
            table_no: tableNumber,
            items: items.map(item => ({
                menu_item_id: item.id,
                quantity: item.quantity,
                price_at_time: item.price,
                menu_item_name: item.name
            }))
        };

        // Capture data for receipt before clearing cart
        setReceiptData({
            items: [...items],
            total,
            subtotal,
            deliveryFee,
            orderType,
            tableNumber,
            customerName: formData.name
        });

        const { success: orderSuccess, data, error } = await createOrder(orderData);

        if (orderSuccess && data) {
            setSuccess(true);
            setOrderId(data.id);
            dispatch(clearCart());
        } else {
            alert("Order failed: " + error);
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generatePDF = () => {
        if (!receiptData) return;
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("The Rooftop Restaurant", 105, 20, { align: "center" });

        doc.setFontSize(14);
        doc.text("Bill Receipt", 105, 30, { align: "center" });

        doc.setFontSize(10);
        doc.text(`Order ID: #${orderId}`, 14, 40);
        doc.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 45);
        if (receiptData.orderType === 'Dine-in') {
            doc.text(`Table No: ${receiptData.tableNumber}`, 14, 50);
        } else {
            doc.text(`Customer: ${receiptData.customerName}`, 14, 50);
        }

        autoTable(doc, {
            startY: 55,
            head: [['Item', 'Qty', 'Price', 'Total']],
            body: receiptData.items.map(item => [item.name, item.quantity, `₹${item.price}`, `₹${item.price * item.quantity}`]),
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        doc.text(`Subtotal: ₹${receiptData.subtotal}`, 140, finalY);
        if (receiptData.deliveryFee > 0) doc.text(`Delivery Fee: ₹${receiptData.deliveryFee}`, 140, finalY + 5);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Grand Total: ₹${receiptData.total}`, 140, finalY + 12);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Thank you for dining with us!", 105, finalY + 30, { align: "center" });

        doc.save(`bill_order_${orderId}.pdf`);
    };

    if (items.length === 0 && !success) return null;

    if (success) {
        return (
            <main className="min-h-screen bg-slate-900 text-slate-50 font-sans">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
                    <div className="bg-slate-800/50 p-12 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-md max-w-lg w-full">
                        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                        <h1 className="text-4xl font-serif font-bold text-amber-500 mb-4">Order Placed!</h1>
                        <p className="text-xl text-slate-300 mb-8">
                            {orderType === 'Dine-in' ? (
                                <>Sit back and relax! We are bringing your food to <strong>Table {tableNumber}</strong>.</>
                            ) : (
                                <>Thank you, <strong>{formData.name}</strong>! We are preparing your meal.</>
                            )}
                        </p>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={generatePDF}
                                className="py-3 px-6 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={20} /> Download Bill (PDF)
                            </button>
                            <Link href="/menu" className="py-3 px-6 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-colors">
                                Order More
                            </Link>
                            <Link href="/" className="text-slate-400 hover:text-amber-500 transition-colors">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-900 text-slate-50 font-sans">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-32">
                <Link href="/menu" className="inline-flex items-center text-slate-400 hover:text-amber-500 mb-8 transition-colors">
                    <ArrowLeft className="mr-2" size={20} /> Back to Menu
                </Link>

                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl font-serif font-bold text-amber-500 flex items-center gap-4">
                        <ShoppingBag size={40} /> Checkout
                    </h1>
                    {orderType === 'Dine-in' && (
                        <div className="px-4 py-2 bg-amber-500/20 text-amber-500 rounded-lg font-bold flex items-center gap-2">
                            <UtensilsCrossed size={18} /> Dine-in: Table {tableNumber}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left: Form */}
                    <div className="space-y-8">
                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                            <h2 className="text-2xl font-bold text-slate-200 mb-6">
                                {orderType === 'Dine-in' ? 'Table Details' : 'Delivery Details'}
                            </h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                {orderType === 'Dine-in' ? (
                                    <>
                                        <div className="p-4 bg-slate-900 rounded-xl text-center border border-slate-700">
                                            <p className="text-slate-400 text-sm uppercase font-bold mb-1">Serving at</p>
                                            <p className="text-3xl font-bold text-amber-500">Table #{tableNumber}</p>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-sm font-bold mb-2 uppercase">Your Name (Optional)</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:border-amber-500 outline-none"
                                                placeholder="Guest Name"
                                                onChange={handleChange}
                                                value={formData.name}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    // Delivery Form
                                    <>
                                        <div>
                                            <label className="block text-slate-400 text-sm font-bold mb-2 uppercase">Full Name</label>
                                            <input type="text" name="name" required className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:border-amber-500 outline-none" placeholder="Your Name" onChange={handleChange} value={formData.name} />
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-sm font-bold mb-2 uppercase">Phone Number</label>
                                            <input type="tel" name="phone" required className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:border-amber-500 outline-none" placeholder="+91 99999 99999" onChange={handleChange} value={formData.phone} />
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-sm font-bold mb-2 uppercase">Delivery Address</label>
                                            <textarea name="address" required rows={3} className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:border-amber-500 outline-none resize-none" placeholder="Street, City, Landmark..." onChange={handleChange} value={formData.address} />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-slate-400 text-sm font-bold mb-2 uppercase">
                                        {orderType === 'Dine-in' ? 'Kitchen Notes (Optional)' : 'Delivery Instructions (Optional)'}
                                    </label>
                                    <textarea
                                        name="notes"
                                        rows={2}
                                        className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-600 focus:border-amber-500 outline-none resize-none"
                                        placeholder={orderType === 'Dine-in' ? "E.g. Less spicy, Extra sauce" : "E.g. Don't ring doorbell"}
                                        onChange={handleChange}
                                        value={formData.notes}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="space-y-8">
                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 sticky top-32">
                            <h2 className="text-2xl font-bold text-slate-200 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center py-4 border-b border-slate-700/50 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-bold text-slate-200">{item.name}</p>
                                                <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-amber-500">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 py-6 border-t border-slate-700">
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>{orderType === 'Dine-in' ? 'Service Charge' : 'Delivery Fee'}</span>
                                    <span>{orderType === 'Dine-in' ? '₹0 (Included)' : `₹${deliveryFee}`}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-slate-700">
                                    <span>Total</span>
                                    <span className="text-amber-500">₹{total}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 font-bold text-xl rounded-xl shadow-lg shadow-amber-500/20 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Placing Order...' : (orderType === 'Dine-in' ? `Confirm Order (Pay Later)` : `Pay ₹${total} (Cash on Delivery)`)}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
