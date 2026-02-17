"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchOrders } from "@/services/orderService"; // Still needed for recent orders if not from stats
import { fetchDashboardStats, DashboardStats } from "@/services/dashboardService";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Users, Clock, Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalReservations: 0,
        todayReservations: [],
        weeklyStats: [] // Added
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [ordersData, statsData] = await Promise.all([
                fetchOrders(),
                fetchDashboardStats()
            ]);

            setRecentOrders(ordersData ? ordersData.slice(0, 5) : []);
            setStats(statsData);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    const statCards = [
        {
            icon: DollarSign,
            label: "Total Sales",
            value: `₹${stats.totalSales.toLocaleString('en-IN')}`,
            color: "bg-green-100 text-green-600"
        },
        {
            icon: ShoppingBag,
            label: "Total Orders",
            value: stats.totalOrders.toString(),
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: Users,
            label: "Reservations",
            value: stats.totalReservations.toString(),
            color: "bg-purple-100 text-purple-600"
        },
        {
            icon: Clock,
            label: "In Progress",
            value: `${stats.pendingOrders} Orders`,
            color: "bg-orange-100 text-orange-600"
        },
    ];

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {statCards.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className={`p-3 sm:p-4 rounded-full ${stat.color}`}>
                            <stat.icon size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">{stat.label}</p>
                            <h3 className="text-lg sm:text-2xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Recent Orders */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-blue-600 font-bold hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <ShoppingBag size={48} className="mx-auto mb-2 opacity-50" />
                                <p>No orders yet</p>
                            </div>
                        ) : (
                            recentOrders.map((order: any) => (
                                <div key={order.id} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 p-3 rounded-lg text-slate-600 font-bold">
                                            #{order.id}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{order.customer_name || 'Guest'}</p>
                                            <p className="text-sm text-slate-500">
                                                {order.items ? `${order.items.length} items` : '...'} • ₹{order.total_amount}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                        order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'Ready' ? 'bg-purple-100 text-purple-700' :
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Today's Reservations */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Today's Reservations</h2>
                        <Link href="/admin/reservations" className="text-sm text-blue-600 font-bold hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {stats.todayReservations.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <Clock size={48} className="mx-auto mb-2 opacity-50" />
                                <p>No reservations for today</p>
                            </div>
                        ) : (
                            stats.todayReservations.map((res: any) => (
                                <div key={res.id} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-white shadow-sm">
                                            {res.customer_name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">{res.customer_name}</h4>
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <Users size={12} /> {res.guests} Guests • <Clock size={12} /> {res.reservation_time}
                                            </p>
                                        </div>
                                    </div>
                                    <a href={`tel:${res.customer_phone}`} className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                                        Call
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
