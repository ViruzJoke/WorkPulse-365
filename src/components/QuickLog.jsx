import React, { useState } from 'react';
import { Send, PlusCircle } from 'lucide-react';

const CATEGORIES = ['Solution', 'Integration', 'Support', 'Meeting', 'Internal'];
const APPS = ['API', 'MyDHL+', 'DEC', 'DGF', 'eAlert', 'Other'];

export default function QuickLog({ onAddLog }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [application, setApplication] = useState(APPS[1]);
    const [customer, setCustomer] = useState('');
    const [targetMonth, setTargetMonth] = useState('');
    const [impact, setImpact] = useState('');

    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        await onAddLog({
            title,
            category,
            application,
            customer,
            targetMonth,
            impact,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date(),
        });
        setLoading(false);
        setTitle('');
        setImpact('');
        setCustomer('');
        setIsExpanded(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 transition-all duration-300 border-l-4 border-dhl-red">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <PlusCircle className="text-dhl-red" size={20} />
                    Quick Log
                </h2>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm text-slate-500 hover:text-dhl-red"
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="What did you achieve today?"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-dhl-yellow focus:border-transparent outline-none transition-all font-medium"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                    />
                    <div className="flex gap-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="flex-1 p-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-dhl-yellow"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {isExpanded && (
                    <div className="animate-in slide-in-from-top-2 duration-200 space-y-3 pt-2 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Application</label>
                                <select
                                    value={application}
                                    onChange={(e) => setApplication(e.target.value)}
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-dhl-yellow"
                                >
                                    {APPS.map(app => (
                                        <option key={app} value={app}>{app}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Target Finish</label>
                                <input
                                    type="month"
                                    value={targetMonth}
                                    onChange={(e) => setTargetMonth(e.target.value)}
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-dhl-yellow"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Customer (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. K.Somsak (ABC Corp)"
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-dhl-yellow"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Impact / Result</label>
                            <textarea
                                placeholder="Details..."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-dhl-yellow focus:border-transparent outline-none transition-all resize-none h-20 text-sm"
                                value={impact}
                                onChange={(e) => setImpact(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !title}
                    className="w-full bg-dhl-red text-white font-bold py-3 rounded-lg hover:bg-red-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : (
                        <>
                            Log Entry <Send size={18} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
