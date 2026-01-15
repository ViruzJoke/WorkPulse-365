const Settings = () => {
    // State initialization from localStorage
    const [scriptUrl, setScriptUrl] = useState(localStorage.getItem('workpulse_script_url') || '');
    const [notifyToken, setNotifyToken] = useState(localStorage.getItem('lineNotifyToken') || '');
    const [defaultPriority, setDefaultPriority] = useState(localStorage.getItem('default_priority') || 'P3');
    const [defaultCategory, setDefaultCategory] = useState(localStorage.getItem('default_category') || 'Standard');
    const [status, setStatus] = useState('');

    const handleSave = () => {
        localStorage.setItem('workpulse_script_url', scriptUrl);
        localStorage.setItem('lineNotifyToken', notifyToken);
        localStorage.setItem('default_priority', defaultPriority);
        localStorage.setItem('default_category', defaultCategory);

        setStatus('Settings Saved Successfully! ✅');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-dhl-red text-white rounded-xl shadow-lg">
                    <Settings size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Application Settings</h2>
                    <p className="text-slate-500 text-sm">Configure your automation and preferences.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-dhl-red"></div>

                {/* Automation Section */}
                <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 flex items-center gap-2">
                    <MessageSquare size={16} /> Automation & Integrations
                </h3>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Google Apps Script Web App URL</label>
                        <input
                            type="text"
                            value={scriptUrl}
                            onChange={e => setScriptUrl(e.target.value)}
                            placeholder="https://script.google.com/macros/s/..."
                            className="w-full p-3 bg-slate-50 border rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-dhl-red outline-none shadow-inner"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Found in your Google Apps Script Deployment (Web App).</p>
                    </div>

                    <div className="opacity-75">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Line Notify Token (Legacy)</label>
                        <input
                            type="password"
                            value={notifyToken}
                            onChange={e => setNotifyToken(e.target.value)}
                            placeholder="Enter Line Notify Token"
                            className="w-full p-3 bg-slate-50 border rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-slate-300 outline-none"
                        />
                    </div>
                </div>

                <div className="h-px bg-slate-100 my-6"></div>

                {/* Preferences Section */}
                <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-sliders"></i> Default Preferences
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Default Priority</label>
                        <select
                            value={defaultPriority}
                            onChange={e => setDefaultPriority(e.target.value)}
                            className="w-full p-3 bg-white border rounded-lg text-sm font-bold outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-dhl-red"
                        >
                            {Object.entries(PRIORITIES).map(([k, v]) => (
                                <option key={k} value={k}>{k} - {v.days} Days</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Default Category</label>
                        <select
                            value={defaultCategory}
                            onChange={e => setDefaultCategory(e.target.value)}
                            className="w-full p-3 bg-white border rounded-lg text-sm font-bold outline-none ring-1 ring-slate-200 focus:ring-dhl-red"
                        >
                            {Object.keys(CATEGORY_MAPPING).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end items-center gap-4">
                {status && <span className="text-green-600 font-bold text-sm animate-pulse">{status}</span>}
                <button
                    onClick={handleSave}
                    className="bg-dhl-red text-white py-3 px-8 rounded-xl font-bold shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    Save Settings
                </button>
            </div>

            <div className="text-center mt-8">
                <p className="text-[10px] text-slate-400">WorkPulse 365 v2.1.0 • Built for DHL Express Support Team</p>
            </div>
        </div>
    );
};
