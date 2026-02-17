"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Image from "next/image";

export default function ManageGallery() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newImage, setNewImage] = useState({ url: "", caption: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setImages(data);
        setLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        if (!supabase) return;
        const { error } = await supabase.from('gallery_images').insert([{ image_url: newImage.url, caption: newImage.caption }]);

        if (error) {
            toast.error("Failed to add image");
        } else {
            toast.success("Image added to gallery");
            setNewImage({ url: "", caption: "" });
            fetchImages();
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: number) => {
        if (!supabase) return;
        const { error } = await supabase.from('gallery_images').delete().eq('id', id);
        if (error) toast.error("Failed to delete");
        else {
            toast.success("Deleted");
            setImages(prev => prev.filter(i => i.id !== id));
        }
    };

    return (
        <div className="max-w-6xl space-y-8 pb-12">
            <h1 className="text-3xl font-bold text-slate-800">Manage Gallery</h1>

            {/* Add Image Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ImageIcon size={20} className="text-amber-500" /> Add New Image
                </h2>
                <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold text-slate-600 mb-1">Image URL</label>
                        <input
                            required
                            type="url"
                            value={newImage.url}
                            onChange={e => setNewImage({ ...newImage, url: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold text-slate-600 mb-1">Caption (Optional)</label>
                        <input
                            value={newImage.caption}
                            onChange={e => setNewImage({ ...newImage, caption: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                            placeholder="Rooftop View at sunset"
                        />
                    </div>
                    <button disabled={submitting} className="w-full md:w-auto px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold transition-colors disabled:opacity-70 h-[42px]">
                        {submitting ? 'Adding...' : 'Add Image'}
                    </button>
                </form>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {loading ? <p>Loading...</p> : images.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                        No images in gallery yet.
                    </div>
                ) : (
                    images.map(img => (
                        <div key={img.id} className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                            <Image
                                src={img.image_url}
                                alt={img.caption || "Gallery Image"}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                <p className="text-white text-sm font-medium truncate mb-2">{img.caption}</p>
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1.5 px-3 rounded shadow-sm w-fit flex items-center gap-1 transition-colors"
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
