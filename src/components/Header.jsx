import React from 'react';
import { Sparkles, Settings } from 'lucide-react';

export default function Header({ onSettingsClick }) {
    return (
        <header className="bg-white/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-200">
            <div className="max-w-md mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-brand-500 p-2 rounded-xl text-white shadow-brand-500/50 shadow-lg">
                        <Sparkles size={24} />
                    </div>
                    <span className="text-slate-800 font-bold text-2xl tracking-tight">Wishlist</span>
                </div>
                <button onClick={onSettingsClick} className="text-slate-500 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <Settings size={24} />
                </button>
            </div>
        </header>
    );
}
