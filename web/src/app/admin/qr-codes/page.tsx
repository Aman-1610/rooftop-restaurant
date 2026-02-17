"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Printer } from "lucide-react";

export default function QrCodesPage() {
    const [tableCount] = useState(10); // Assume 10 tables for now
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rooftop-restaurant.com';

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center print:hidden">
                <h1 className="text-3xl font-bold text-slate-800">QR Codes</h1>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                    <Printer size={18} /> Print All
                </button>
            </div>

            <p className="text-slate-500 print:hidden">
                Print these QR codes and place them on tables. Customers can scan them to view the menu and order.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 print:grid-cols-3 print:gap-4">
                {Array.from({ length: tableCount }).map((_, i) => {
                    const tableNum = i + 1;
                    const url = `${baseUrl}/dine-in?table=${tableNum}`;

                    return (
                        <div key={tableNum} className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-slate-800 print:p-4 break-inside-avoid">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider">Table {tableNum}</h3>
                            <div className="bg-white p-2 rounded-lg">
                                <QRCodeCanvas value={url} size={150} level={"H"} includeMargin={true} />
                            </div>
                            <p className="text-xs text-slate-400 mt-4 font-mono text-center break-all">{url}</p>
                            <p className="text-sm font-bold text-amber-600 mt-2">Scan to Order</p>
                        </div>
                    );
                })}
            </div>

            <div className="hidden print:block text-center mt-8 text-slate-400 text-xs">
                The Rooftop Restaurant - Dine-in Ordering System
            </div>
        </div>
    );
}
