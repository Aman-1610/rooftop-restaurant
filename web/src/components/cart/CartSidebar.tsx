"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus, X, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toggleCart, removeFromCart, updateQuantity } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CartSidebar() {
    const { items, isOpen } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const router = useRouter();

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => dispatch(toggleCart())}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                            <h2 className="text-2xl font-serif font-bold text-amber-500 flex items-center gap-2">
                                <ShoppingCart size={24} />
                                Your Order
                            </h2>
                            <button
                                onClick={() => dispatch(toggleCart())}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                                        <ShoppingCart size={40} />
                                    </div>
                                    <p className="text-xl text-slate-300 font-medium">Your cart is empty</p>
                                    <p className="text-slate-500 max-w-xs">Looks like you haven't added any delicious items yet.</p>
                                    <button
                                        onClick={() => dispatch(toggleCart())}
                                        className="mt-4 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-amber-500 font-bold rounded-xl transition-colors"
                                    >
                                        Browse Menu
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700"
                                    >
                                        {/* Placeholder image logic or pass from item if added to store */}
                                        <div className="w-20 h-20 bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                                            {/* Would need image URL in cart item for real image */}
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs">No Img</div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-slate-200 line-clamp-1">{item.name}</h3>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                    className="text-slate-500 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-2">
                                                <p className="font-bold text-amber-500">₹{item.price * item.quantity}</p>

                                                <div className="flex items-center gap-3 bg-slate-900 rounded-full px-1 py-1 border border-slate-700">
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                        className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                        className="w-7 h-7 flex items-center justify-center bg-amber-500 hover:bg-amber-600 rounded-full text-slate-900 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md">
                                <div className="flex justify-between items-center mb-4 text-slate-300">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-white text-lg">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center mb-6 text-sm text-slate-500">
                                    <span>Taxes & charges calculated at checkout</span>
                                </div>

                                <button
                                    onClick={() => {
                                        dispatch(toggleCart());
                                        router.push("/checkout");
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:scale-[1.02] transition-all"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
