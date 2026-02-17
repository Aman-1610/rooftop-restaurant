import { supabase } from "@/lib/supabase";

export interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    display_order: number;
    created_at?: string;
}

export const fetchFeatures = async () => {
    if (!supabase) return [];

    // Fallback data if table doesn't exist yet or is empty
    const defaultFeatures: Feature[] = [
        { id: 1, title: "Signature Cocktails", description: "Handcrafted mocktails and beverages designed to perfectly complement your evening under the stars.", icon: "GlassWater", display_order: 1 },
        { id: 2, title: "Authentic Cuisine", description: "A fusion of local flavors and modern culinary techniques, sourcing the freshest ingredients daily.", icon: "Utensils", display_order: 2 },
        { id: 3, title: "Panoramic Views", description: "The perfect sunset spot in Kahalgaon, offering breathtaking views of the city skyline and river.", icon: "View", display_order: 3 }
    ];

    try {
        const { data, error } = await supabase
            .from('features')
            .select('*')
            .order('display_order', { ascending: true });

        if (error || !data || data.length === 0) return defaultFeatures;
        return data as Feature[];
    } catch (err) {
        console.error("Error fetching features:", err);
        return defaultFeatures;
    }
};

export const addFeature = async (feature: Omit<Feature, 'id' | 'created_at'>) => {
    if (!supabase) return { success: false, error: "Supabase not initialized" };

    const { error } = await supabase.from('features').insert([feature]);
    return { success: !error, error: error?.message };
};

export const updateFeature = async (id: number, feature: Partial<Feature>) => {
    if (!supabase) return { success: false, error: "Supabase not initialized" };

    const { error } = await supabase.from('features').update(feature).eq('id', id);
    return { success: !error, error: error?.message };
};

export const deleteFeature = async (id: number) => {
    if (!supabase) return { success: false, error: "Supabase not initialized" };

    const { error } = await supabase.from('features').delete().eq('id', id);
    return { success: !error, error: error?.message };
};
