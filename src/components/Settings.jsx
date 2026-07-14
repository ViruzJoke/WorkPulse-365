import React, { useState, useEffect } from 'react';
import { Save, Loader2, ArrowLeft } from 'lucide-react';

export default function Settings({ onClose }) {
    const [lineToken, setLineToken] = useState('');
    const [googleScriptUrl, setGoogleScriptUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('line_notify_token');
        if (storedToken) setLineToken(storedToken);
        const storedUrl = localStorage.getItem('google_script_url');
        if (storedUrl) setGoogleScriptUrl(storedUrl);
    }, []);

    const handleSave = () => {
        setLoading(true);
        localStorage.setItem('line_notify_token', lineToken);
        localStorage.setItem('google_script_url', googleScriptUrl);
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
                    <div className="glass-panel rounded-2xl p-6 shadow-glass-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-2">LINE Notification</h2>
                        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                            Enter your LINE Notify token to receive alerts when a new item is added to your wishlist.
                        </p>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">LINE Notify Token</label>
                                <input
                                    type="password"
                                    placeholder="Enter token here..."
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all font-medium"
                                    value={lineToken}
                                    onChange={(e) => setLineToken(e.target.value)}
                                />
                                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                                    You can get this from <a href="https://notify-bot.line.me/" target="_blank" rel="noreferrer" className="text-brand-600 font-semibold hover:underline">LINE Notify</a>. 
                                    <br/><br/>
                                    Note: We use a public proxy to bypass CORS restrictions.
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Google Apps Script URL (Automation Trigger)</label>
                                <input
                                    type="url"
                                    placeholder="https://script.google.com/macros/s/.../exec"
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all font-medium"
                                    value={googleScriptUrl}
                                    onChange={(e) => setGoogleScriptUrl(e.target.value)}
                                />
                                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                                    This URL will be called to trigger your custom Google Apps Script automation.
                                </p>
                            </div>
                            
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
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
