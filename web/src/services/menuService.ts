
import { supabase } from '@/lib/supabase';

// Mock Data
export const mockMenuItems = [
    {
        id: 1,
        name: "Crispy Szechuan Prawns",
        price: 450,
        description: "Jumbo prawns tossed in fiery Szechuan sauce, garnished with scallions.",
        category: "Starters",
        image_url: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=200",
        available: true,
        is_popular: true,
        is_spicy: true
    },
    {
        id: 2,
        name: "Paneer Tikka Angara",
        price: 320,
        description: "Cottage cheese marinated in spicy yogurt and grilled to perfection in tandoor.",
        category: "Starters",
        image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=200",
        available: true,
        is_popular: false,
        is_spicy: true,
        is_veg: true
    },
    {
        id: 3,
        name: "Butter Chicken Delhi Style",
        price: 480,
        description: "Tender chicken simmered in a rich tomato and butter gravy alongside cashew paste.",
        category: "Main Course",
        image_url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=200",
        available: true,
        is_popular: true
    },
    {
        id: 4,
        name: "Vegetable Biryani",
        price: 350,
        description: "Aromatic basmati rice cooked with seasonal vegetables and whole spices.",
        category: "Main Course",
        image_url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=200",
        available: true,
        is_veg: true
    },
    {
        id: 5,
        name: "Blue Lagoon Mocktail",
        price: 180,
        description: "Refreshing blue curaçao syrup mixed with lime and soda.",
        category: "Drinks",
        image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=200",
        available: true,
        is_veg: true
    },
    {
        id: 6,
        name: "Chocolate Lava Cake",
        price: 250,
        description: "Warm chocolate cake with a gooey center, served with vanilla ice cream.",
        category: "Desserts",
        image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=200",
        available: true,
        is_popular: true,
        is_veg: true
    },
];

export async function fetchAllMenuItems() {
    if (!supabase) {
        console.warn("Supabase client not initialized. Returning mock data.");
        return mockMenuItems;
    }

    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Error fetching all menu items:", error);
        return mockMenuItems;
    }
    return data;
}

export async function fetchMenuItems() {
    if (!supabase) {
        console.warn("Supabase client not initialized. Returning mock data.");
        return mockMenuItems;
    }

    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('category', { ascending: true });

    if (error) {
        console.error("Error fetching menu items:", error);
        return mockMenuItems; // Fallback
    }

    return data;
}

// CRUD for Menu Items
export async function addMenuItem(item: any) {
    if (!supabase) return { success: false, error: "Supabase not initialized" };

    // Remove ID if present (let DB handle it)
    const { id, ...newItem } = item;

    const { data, error } = await supabase
        .from('menu_items')
        .insert([newItem])
        .select();

    if (error) {
        console.error("Error adding menu item:", error);
        return { success: false, error };
    }
    return { success: true, data };
}

export async function updateMenuItem(id: number, updates: any) {
    if (!supabase) return { success: false, error: "Supabase not initialized" };

    const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error("Error updating menu item:", error);
        return { success: false, error };
    }
    return { success: true, data };
}

export async function deleteMenuItem(id: number) {
    if (!supabase) return { success: false, error: "Supabase not initialized" };

    const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Error deleting menu item:", error);
        return { success: false, error };
    }
    return { success: true };
}

// Reservation Functions
export async function fetchReservations() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: true });

    if (error) {
        console.error("Error fetching reservations:", error);
        return [];
    }
    return data;
}

export async function updateReservationStatus(id: number, status: string) {
    if (!supabase) return { success: false };

    const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error("Error updating reservation:", error);
        return { success: false, error };
    }
    return { success: true };
}

export async function createReservation(reservation: any) {
    if (!supabase) {
        console.warn("Supabase client not initialized. Returning mock success.");
        return { success: true };
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.warn("Supabase keys missing. Returning mock success.");
        return { success: true };
    }

    const { error } = await supabase
        .from('reservations')
        .insert([reservation]);

    if (error) {
        console.error("Error creating reservation:", error);
        return { success: false, error };
    }

    return { success: true };
}
