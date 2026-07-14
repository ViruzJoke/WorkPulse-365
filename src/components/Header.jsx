import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Settings } from 'lucide-react';

export default function Header({ onSettingsClick, user, onSignOut }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

    return (
        <header className="bg-white/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-200">
            <div className="max-w-md mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-brand-500 p-2 rounded-xl text-white shadow-brand-500/50 shadow-lg">
                        <Sparkles size={24} />
                    </div>
                    <span className="text-slate-800 font-bold text-2xl tracking-tight">Wishlist</span>
                </div>
                {user && (
                <div className="relative ml-auto" ref={dropdownRef}>
                    <button className="flex items-center space-x-2 focus:outline-none" onClick={() => setShowDropdown(prev => !prev)}>
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm">
                                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                    </button>
                    {/* Dropdown menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200">
                            <button onClick={onSignOut} className="w-full text-left px-4 py-2 hover:bg-slate-100">Sign out</button>
                        </div>
                    )}
                </div>
                )}
                <button onClick={onSettingsClick} className="text-slate-500 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <Settings size={24} />
                </button>
            </div>
        </header>
    );
}
