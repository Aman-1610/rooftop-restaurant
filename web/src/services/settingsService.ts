
import { supabase } from "@/lib/supabase";

export interface Settings {
    id: number;
    restaurant_name: string;
    address: string;
    phone: string;
    table_count: number;
    delivery_fee: number;
    notifications_enabled: boolean;
    navbar_title: string;
    email: string;
    opening_hours: string;
    social_instagram: string;
    social_facebook: string;
    google_maps_link: string;
}

export const fetchSettings = async () => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('settings') // Ensure table exists
            .select('*')
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Not found, try to fix by re-running SQL manually or handle gracefully
                return null;
            }
            throw error;
        }
        return data as Settings;
    } catch (error: any) {
        console.error("Error fetching settings:", error.message);
        return null;
    }
};

export const updateSettings = async (settings: Partial<Settings>) => {
    if (!supabase) return { success: true };

    try {
        // If an ID is provided, use it. Otherwise default to 1.
        const targetId = settings.id || 1;

        const { error } = await supabase
            .from('settings')
            .update(settings)
            .eq('id', targetId);

        if (error) {
            console.error("Supabase update error:", error);
            throw error;
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error updating settings service:", error.message);
        return { success: false, error: error.message };
    }
};
