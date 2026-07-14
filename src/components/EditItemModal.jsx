import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Image as ImageIcon, UploadCloud } from 'lucide-react';
import convertToBase64 from '../utils/convertToBase64';

export default function EditItemModal({ item, onClose, onSave }) {
    const [title, setTitle] = useState(item.title || '');
    const [price, setPrice] = useState(item.price || '');
    const [category, setCategory] = useState(item.category || 'Normal');
    const [imageUrl, setImageUrl] = useState(item.imageUrl || '');
    const [url, setUrl] = useState(item.url || '');
    const [saving, setSaving] = useState(false);

    const priceInputRef = useRef(null);

    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
        };
        const input = priceInputRef.current;
        if (input) {
            input.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (input) {
                input.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    const handleImageChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const base64 = await convertToBase64(file);
                setImageUrl(base64);
            } catch (err) {
                console.error("Error converting image to Base64:", err);
                alert("Failed to process image. Please try a smaller file.");
            }
        }
    };

    const handleRemoveImage = () => {
        setImageUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(item.id, { title, price: Number(price), category, imageUrl, url });
            onClose();
        } catch (error) {
            console.error('Error saving item:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800">Edit Item</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Item Name</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Price (฿)</label>
                            <input
                                ref={priceInputRef}
                                type="number"
                                required
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium appearance-none"
                            >
                                <option value="Need">Need (Must have)</option>
                                <option value="Normal">Normal (Want soon)</option>
                                <option value="Want">Want (Maybe later)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Item URL (Optional)</label>
                        <input
                            type="url"
                            placeholder="https://example.com/product/..."
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm font-medium"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                            <ImageIcon size={16} className="text-slate-400"/>
                            Picture <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative bg-white/30 animate-all">
                            {imageUrl ? (
                                <div className="relative inline-block">
                                    <img src={imageUrl} alt="Preview" className="h-32 object-contain rounded-lg shadow-sm border border-slate-100" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-md p-1 border border-slate-100 transition-colors"
                                        title="Remove picture"
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center font-bold text-xs">✕</span>
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-slate-500 py-4">
                                    <UploadCloud size={32} className="text-slate-400" />
                                    <span className="text-sm font-medium">Click to upload an image</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
