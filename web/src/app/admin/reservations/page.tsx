"use client";

import { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { fetchReservations, updateReservationStatus } from "@/services/menuService";
import { useEffect } from "react";

export default function ReservationsManager() {
    const [items, setItems] = useState<any[]>([]);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    useEffect(() => {
        async function loadData() {
            const data = await fetchReservations();
            setItems(data || []);
        }
        loadData();
    }, [lastUpdate]);

    const confirmReservation = async (id: number) => {
        const { success } = await updateReservationStatus(id, "Confirmed");
        if (success) setLastUpdate(Date.now());
    };

    const cancelReservation = async (id: number) => {
        if (confirm("Cancel this reservation?")) {
            const { success } = await updateReservationStatus(id, "Cancelled");
            if (success) setLastUpdate(Date.now());
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Reservation Manager</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3 font-medium">Guest</th>
                            <th className="px-6 py-3 font-medium">Date & Time</th>
                            <th className="px-6 py-3 font-medium">Guests</th>
                            <th className="px-6 py-3 font-medium">Phone</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-800">{item.customer_name}</td>
                                <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                                    <Clock size={16} className="text-slate-400" />
                                    {item.reservation_date} at {item.reservation_time}
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{item.guests}</td>
                                <td className="px-6 py-4 text-blue-600 hover:underline">
                                    <a href={`tel:${item.customer_phone}`}>{item.customer_phone}</a>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.status === "Confirmed"
                                        ? "bg-green-100 text-green-700 border-green-200"
                                        : item.status === "Cancelled"
                                            ? "bg-red-100 text-red-700 border-red-200"
                                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {item.status === "Pending" && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => confirmReservation(item.id)}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold flex items-center gap-1 transition-colors shadow-sm"
                                            >
                                                <CheckCircle size={14} /> Accept
                                            </button>
                                            <button
                                                onClick={() => cancelReservation(item.id)}
                                                className="px-3 py-1 bg-white border border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    {item.status === "Confirmed" && (
                                        <span className="text-green-600 text-sm font-medium flex items-center justify-end gap-1">
                                            <CheckCircle size={14} /> Sent
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
