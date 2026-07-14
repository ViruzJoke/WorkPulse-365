import React, { useState } from 'react';
import { Trash2, Image as ImageIcon, Check, ExternalLink, RotateCcw } from 'lucide-react';
import ImageModal from './ImageModal';
import EditItemModal from './EditItemModal';

const CATEGORY_STYLES = {
    'Need': 'text-accent-600 bg-accent-50 border-accent-200',
    'Normal': 'text-brand-600 bg-brand-50 border-brand-200',
    'Want': 'text-slate-600 bg-slate-100 border-slate-200'
};

export default function Wishlist({ items, onDelete, onEdit, onArchive, onRedo, quickBuyThreshold, currentMode, onModeChange }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [viewMode, setViewMode] = useState(null); // 'image' or 'edit'
    
    // Filters State
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [quickBuyActive, setQuickBuyActive] = useState(false);
    const [historyExpanded, setHistoryExpanded] = useState(false);
    // Mode filter (uses global currentMode)
    const handleModeClick = (mode) => {
        if (onModeChange) onModeChange(mode);
    };

    const handleImageClick = (item) => {
        setSelectedItem(item);
        setViewMode('image');
    };

    const handleTitleClick = (item) => {
        setSelectedItem(item);
        setViewMode('edit');
    };

    const closeModal = () => {
        setSelectedItem(null);
        setViewMode(null);
    };

    // Partition items into active vs bought
    const activeItems = items.filter(item => !item.bought && item.mode === currentMode);
    const boughtItems = items.filter(item => item.bought && item.mode === currentMode);

    // Apply active wishlist filters
    const filteredActiveItems = activeItems.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesQuickBuy = !quickBuyActive || (Number(item.price) <= Number(quickBuyThreshold || 0));
        return matchesCategory && matchesQuickBuy;
    });

    return (
        <div className="space-y-4 pb-10">
            {/* Mode Switch */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handleModeClick('Personal')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        currentMode === 'Personal' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white/80 text-slate-500 border border-slate-200/60 hover:bg-slate-50'
                    }`}
                >
                    Personal
                </button>
                <button
                    onClick={() => handleModeClick('Family')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        currentMode === 'Family' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white/80 text-slate-500 border border-slate-200/60 hover:bg-slate-50'
                    }`}
                >
                    Family
                </button>
            </div>
            <div className="flex flex-col gap-3 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 shadow-glass-sm">
                <div className="flex flex-wrap gap-1.5">
                    {['All', 'Need', 'Normal', 'Want'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                selectedCategory === cat
                                    ? 'bg-slate-800 text-white shadow-sm'
                                    : 'bg-white/80 text-slate-500 border border-slate-200/60 hover:bg-slate-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                {quickBuyThreshold && Number(quickBuyThreshold) > 0 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs font-bold text-slate-500">
                            Quick Buy (฿{Number(quickBuyThreshold).toLocaleString()} or less)
                        </span>
                        <button
                            type="button"
                            onClick={() => setQuickBuyActive(!quickBuyActive)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                quickBuyActive ? 'bg-brand-600' : 'bg-slate-200'
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    quickBuyActive ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                )}
            </div>

            {/* Active Items List */}
            {filteredActiveItems.length > 0 ? (
                <div className="space-y-4">
                    {filteredActiveItems.map(item => (
                        <div key={item.id} className="glass-panel rounded-2xl p-4 shadow-glass-sm flex gap-4 items-center group transition-all hover:-translate-y-1 hover:shadow-glass">
                            <div 
                                className="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200/50 shadow-inner cursor-pointer" 
                                onClick={() => handleImageClick(item)}
                            >
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="text-slate-300" size={28} />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <h3 
                                                className="font-bold text-slate-800 text-lg truncate leading-tight cursor-pointer hover:text-brand-600 transition-colors" 
                                                onClick={() => handleTitleClick(item)}
                                            >
                                                {item.title}
                                            </h3>
                                            {item.url && (
                                                <a 
                                                    href={item.url} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="text-slate-400 hover:text-brand-500 transition-colors flex-shrink-0"
                                                    title="Open product link"
                                                >
                                                    <ExternalLink size={15} />
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-brand-600 font-black text-base">
                                            ฿{Number(item.price).toLocaleString()}
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border whitespace-nowrap shadow-sm ${CATEGORY_STYLES[item.category] || CATEGORY_STYLES['Normal']}`}>
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => onArchive(item.id)}
                                    className="p-2.5 text-slate-300 hover:text-white hover:bg-emerald-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm shadow-emerald-500/0 hover:shadow-emerald-500/30"
                                    title="Mark as bought"
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="p-2.5 text-slate-300 hover:text-white hover:bg-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm shadow-red-500/0 hover:shadow-red-500/30"
                                    title="Delete item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 text-slate-400 glass-panel rounded-2xl border border-dashed border-slate-300">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No wishes found matching filters.</p>
                </div>
            )}

            {/* Collapsible Purchase History */}
            {boughtItems.length > 0 && (
                <div className="mt-8 border-t border-slate-200/60 pt-6">
                    <button
                        type="button"
                        onClick={() => setHistoryExpanded(!historyExpanded)}
                        className="w-full flex items-center justify-between py-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-xs uppercase tracking-wider"
                    >
                        <span>Purchase History ({boughtItems.length})</span>
                        <span className="text-xs transition-transform duration-200" style={{ transform: historyExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            ▼
                        </span>
                    </button>
                    
                    {historyExpanded && (
                        <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            {boughtItems.map(item => (
                                <div key={item.id} className="glass-panel rounded-2xl p-4 flex gap-4 items-center group opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200/50 shadow-inner">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale" />
                                        ) : (
                                            <ImageIcon className="text-slate-300" size={24} />
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <h3 className="font-bold text-slate-400 text-base truncate line-through">
                                                {item.title}
                                            </h3>
                                            {item.url && (
                                                <a 
                                                    href={item.url} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="text-slate-300 hover:text-brand-400 transition-colors flex-shrink-0"
                                                    title="Open product link"
                                                >
                                                    <ExternalLink size={13} />
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-slate-400 font-bold text-sm">
                                            ฿{Number(item.price).toLocaleString()}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => onRedo(item.id)}
                                            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
                                            title="Move back to active wishes"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="p-2.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
                                            title="Delete permanently"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedItem && viewMode === 'image' && (
                <ImageModal imageUrl={selectedItem.imageUrl} onClose={closeModal} />
            )}

            {selectedItem && viewMode === 'edit' && (
                <EditItemModal item={selectedItem} onClose={closeModal} onSave={onEdit} />
            )}
        </div>
    );
}
