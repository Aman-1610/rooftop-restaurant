import { supabase } from "@/lib/supabase";

export interface OrderItem {
    id?: number; // Optional on creation
    menu_item_id: number;
    quantity: number;
    price_at_time: number;
    menu_item_name: string;
}

export interface Order {
    id?: number;
    created_at?: string;
    status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
    customer_name: string;
    phone: string;
    address: string;
    total_amount: number;
    notes?: string;
    payment_method: 'COD' | 'UPI' | 'Card';
    items: OrderItem[]; // Frontend helper, will map to order_items table
    order_type?: 'Delivery' | 'Pickup' | 'Dine-in';
    table_no?: string;
}

// ------------------------------------------------------------------
// Create New Order
// ------------------------------------------------------------------
export const createOrder = async (orderData: Order) => {
    if (!supabase) {
        console.warn("Supabase client not initialized. Using mock data.");
        return { success: true, data: { id: 999, ...orderData } };
    }

    try {
        // 1. Insert Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    customer_name: orderData.customer_name,
                    phone: orderData.phone,
                    address: orderData.address,
                    total_amount: orderData.total_amount,
                    notes: orderData.notes,
                    payment_method: orderData.payment_method,
                    status: 'Pending',
                    order_type: orderData.order_type || 'Delivery',
                    table_no: orderData.table_no
                }
            ])
            .select()
            .single();

        if (orderError) throw orderError;
        if (!order) throw new Error("Order creation failed.");

        // 2. Insert Order Items
        const itemsToInsert = orderData.items.map(item => ({
            order_id: order.id,
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            price_at_time: item.price_at_time,
            menu_item_name: item.menu_item_name
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        return { success: true, data: order };
    } catch (error: any) {
        console.error("Error creating order:", error.message);
        return { success: false, error: error.message };
    }
};

// ------------------------------------------------------------------
// Fetch All Orders (Admin Dashboard)
// ------------------------------------------------------------------
export const fetchOrders = async () => {
    if (!supabase) return [];

    try {
        // Fetch orders with their items
        const { data, error } = await supabase
            .from('orders')
            .select(`
          *,
          order_items (
            id,
            menu_item_id,
            quantity,
            price_at_time,
            menu_item_name
          )
        `)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }
        return data || [];
    } catch (error: any) {
        console.error("Error fetching orders:", error.message);
        return [];
    }
};

// ------------------------------------------------------------------
// Update Order Status
// ------------------------------------------------------------------
export const updateOrderStatus = async (id: number, status: string) => {
    if (!supabase) return { success: true };

    try {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Error updating order status:", error.message);
        return { success: false, error: error.message };
    }
};

export const fetchOrderById = async (id: number) => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
          *,
          order_items (
            id,
            menu_item_id,
            quantity,
            price_at_time,
            menu_item_name
          )
        `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error("Error fetching order by ID:", error.message);
        return null;
    }
};
