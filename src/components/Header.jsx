import React from 'react';
import { Menu } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-dhl-yellow p-4 shadow-md sticky top-0 z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/* DHL Logo approximation */}
                    <h1 className="text-dhl-red font-black italic text-3xl tracking-tighter transform -skew-x-12">
                        DHL
                    </h1>
                    <span className="text-dhl-red font-bold text-xl ml-2">WorkPulse 365</span>
                </div>
                <button className="text-dhl-red p-2 hover:bg-white/20 rounded-full transition-colors">
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
}
