
import { supabase } from "@/lib/supabase";

export interface Feedback {
    id?: number;
    created_at?: string;
    customer_name?: string;
    contact_info?: string;
    rating: number;
    message?: string;
}

export const submitFeedback = async (feedback: Feedback) => {
    if (!supabase) return { success: true }; // Mock success if no supabase

    try {
        const { error } = await supabase
            .from('feedbacks')
            .insert([feedback]);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Error submitting feedback:", error.message);
        return { success: false, error: error.message };
    }
};

export const fetchFeedbacks = async () => {
    if (!supabase) return [];

    try {
        const { data, error } = await supabase
            .from('feedbacks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error: any) {
        console.error("Error fetching feedbacks:", error.message);
        return [];
    }
};
