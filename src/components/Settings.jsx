import React, { useState, useEffect } from 'react';
import { Save, Loader2, ArrowLeft } from 'lucide-react';

export default function Settings({ onClose }) {
    const [googleScriptUrl, setGoogleScriptUrl] = useState('');
    const [quickBuyThreshold, setQuickBuyThreshold] = useState('');
    const [showGasUrl, setShowGasUrl] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedUrl = localStorage.getItem('google_script_url');
        if (storedUrl) setGoogleScriptUrl(storedUrl);
        const storedThreshold = localStorage.getItem('quick_buy_threshold');
        if (storedThreshold) setQuickBuyThreshold(storedThreshold);
    }, []);

    const handleSave = () => {
        setLoading(true);
        localStorage.setItem('google_script_url', googleScriptUrl);
        localStorage.setItem('quick_buy_threshold', quickBuyThreshold);
        setTimeout(() => {
            setLoading(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto font-sans">
            <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl border-x border-slate-100">
                <header className="bg-white/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="font-bold text-xl text-slate-800 tracking-tight">Settings</h1>
                    </div>
                </header>

                <div className="p-6 space-y-8">
                    <div className="glass-panel rounded-2xl p-6 shadow-glass-sm space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">Configurations</h2>
                            <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                Customize your wishlist quick filters and Google Script integrations.
                            </p>
                        </div>
                        
                        <div className="space-y-5">
                            {/* Quick Buy Settings */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Quick Buy Threshold (฿)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all font-medium"
                                    value={quickBuyThreshold}
                                    onChange={(e) => setQuickBuyThreshold(e.target.value)}
                                />
                                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                    Items with prices equal to or below this amount can be filtered by toggling the "Quick Buy" filter on your list.
                                </p>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Google Script Settings (Hidden by default) */}
                            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">Google Apps Script URL</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {googleScriptUrl ? "✓ Configured (Hidden)" : "Not set"}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowGasUrl(!showGasUrl)}
                                        className="text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors text-slate-600 shadow-sm"
                                    >
                                        {showGasUrl ? 'Hide URL' : 'Show / Edit'}
                                    </button>
                                </div>
                                
                                {showGasUrl && (
                                    <div className="mt-4 pt-4 border-t border-slate-200/50 animate-in fade-in duration-200">
                                        <input
                                            type="url"
                                            placeholder="https://script.google.com/macros/s/.../exec"
                                            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium text-sm"
                                            value={googleScriptUrl}
                                            onChange={(e) => setGoogleScriptUrl(e.target.value)}
                                        />
                                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                            This webhook URL triggers your Google Apps Script notification pipeline.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {saved ? 'Saved!' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
