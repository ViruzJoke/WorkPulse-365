import React from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';

const CATEGORY_STYLES = {
    'Need': 'text-accent-600 bg-accent-50 border-accent-200',
    'Normal': 'text-brand-600 bg-brand-50 border-brand-200',
    'Want': 'text-slate-600 bg-slate-100 border-slate-200'
};

export default function Wishlist({ items, onDelete }) {
    if (items.length === 0) {
        return (
            <div className="text-center p-10 text-slate-400 glass-panel rounded-2xl border border-dashed border-slate-300">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-medium">Your wishlist is empty.</p>
                <p className="text-sm mt-1">Add something you want to buy!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-10">
            {items.map(item => (
                <div key={item.id} className="glass-panel rounded-2xl p-4 shadow-glass-sm flex gap-4 items-center group transition-all hover:-translate-y-1 hover:shadow-glass">
                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200/50 shadow-inner">
                        {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="text-slate-300" size={28} />
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg truncate leading-tight mb-1">{item.title}</h3>
                                <div className="text-brand-600 font-black text-base">
                                    ฿{Number(item.price).toLocaleString()}
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border whitespace-nowrap shadow-sm ${CATEGORY_STYLES[item.category] || CATEGORY_STYLES['Normal']}`}>
                                {item.category}
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-2.5 text-slate-300 hover:text-white hover:bg-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm shadow-red-500/0 hover:shadow-red-500/30"
                        title="Delete item"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
}
