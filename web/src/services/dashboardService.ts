import { supabase } from '@/lib/supabase';
import { fetchOrders } from './orderService';
import { fetchReservations } from './menuService';

export interface WeeklyStat {
    name: string;
    sales: number;
    orders: number;
}

export interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    totalReservations: number;
    todayReservations: any[];
    weeklyStats: WeeklyStat[];
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
    if (!supabase) {
        return {
            totalSales: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalReservations: 0,
            todayReservations: [],
            weeklyStats: []
        };
    }

    try {
        // Fetch all orders
        const orders = await fetchOrders(); // This fetches items too, might be heavy in production but ok for MVP

        // Fetch all reservations
        const reservations = await fetchReservations();

        // Calculate Stats
        const totalSales = orders.reduce((sum: number, order: any) => {
            if (order.status !== 'Cancelled') {
                return sum + (order.total_amount || 0);
            }
            return sum;
        }, 0);

        const totalOrders = orders.length;
        const pendingOrders = orders.filter((o: any) => o.status === 'Pending').length;
        const totalReservations = reservations ? reservations.length : 0;

        // Today's Reservations
        const todayStr = new Date().toISOString().split('T')[0];
        const todayReservations = reservations ? reservations.filter((r: any) => r.reservation_date === todayStr) : [];

        // Weekly Stats Calculation
        const weeklyStats: WeeklyStat[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const dayOrders = orders.filter((o: any) => o.created_at.startsWith(dateStr) && o.status !== 'Cancelled');

            const sales = dayOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

            weeklyStats.push({
                name: dayName,
                sales,
                orders: dayOrders.length
            });
        }

        return {
            totalSales,
            totalOrders,
            pendingOrders,
            totalReservations,
            todayReservations,
            weeklyStats
        };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            totalSales: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalReservations: 0,
            todayReservations: [],
            weeklyStats: []
        };
    }
}
