import React, { useState } from 'react';
import { Plus, UploadCloud, Loader2 } from 'lucide-react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CATEGORIES = [
    { id: 'Need', label: 'Need (High Priority)' },
    { id: 'Normal', label: 'Normal (Medium Priority)' },
    { id: 'Want', label: 'Want (Low Priority)' }
];

export default function AddItem({ onAdd }) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Normal');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !price) return;
        setLoading(true);

        let imageUrl = null;
        if (imageFile) {
            try {
                const imageRef = ref(storage, `wishlist/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            } catch (err) {
                console.error("Error uploading image:", err);
                alert("Failed to upload image. Please check your Firebase Storage rules.");
                setLoading(false);
                return;
            }
        }

        await onAdd({
            title,
            price: Number(price),
            category,
            imageUrl,
            date: new Date().toISOString(),
            createdAt: new Date(),
        });

        setLoading(false);
        setTitle('');
        setPrice('');
        setCategory('Normal');
        setImageFile(null);
        setImagePreview(null);
    };

    return (
        <div className="glass-panel rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="text-brand-500" size={24} />
                Add New Wish
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">What do you want?</label>
                    <input
                        type="text"
                        placeholder="e.g. MacBook Pro M3"
                        className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all font-medium"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Estimated Cost</label>
                        <input
                            type="number"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all font-medium"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all font-medium"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Picture (Optional)</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative bg-white/30">
                        {imagePreview ? (
                            <div className="relative inline-block">
                                <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-lg" />
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                    className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-md p-1 border border-slate-100"
                                >
                                    <span className="w-5 h-5 flex items-center justify-center font-bold text-xs">✕</span>
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-slate-500">
                                <UploadCloud size={32} className="text-slate-400" />
                                <span className="text-sm font-medium">Click to upload an image</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !title || !price}
                    className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    {loading ? 'Adding...' : 'Add to Wishlist'}
                </button>
            </form>
        </div>
    );
}
