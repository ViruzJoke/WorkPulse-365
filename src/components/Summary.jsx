import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
    'Need': '#f43f5e', // accent-500
    'Normal': '#14b8a6', // brand-500
    'Want': '#94a3b8'  // slate-400
};

export default function Summary({ items }) {
    const activeItems = useMemo(() => items.filter(i => !i.bought), [items]);

    const { chartData, totals, grandTotal } = useMemo(() => {
        const catTotals = { Need: 0, Normal: 0, Want: 0 };
        
        activeItems.forEach(item => {
            const price = Number(item.price) || 0;
            if (catTotals[item.category] !== undefined) {
                catTotals[item.category] += price;
            } else {
                catTotals['Normal'] += price;
            }
        });

        const data = [
            { name: 'Need', value: catTotals.Need },
            { name: 'Normal', value: catTotals.Normal },
            { name: 'Want', value: catTotals.Want }
        ].filter(d => d.value > 0);

        const total = data.reduce((sum, d) => sum + d.value, 0);

        return { chartData: data, totals: catTotals, grandTotal: total };
    }, [activeItems]);

    const monthlyStats = useMemo(() => {
        const stats = {}; // key: "YYYY-MM", value: sum
        const bought = items.filter(i => i.bought && i.boughtDate);
        bought.forEach(item => {
            const [year, monthStr] = item.boughtDate.split('-');
            const key = `${year}-${monthStr}`;
            const price = Number(item.price) || 0;
            stats[key] = (stats[key] || 0) + price;
        });
        
        // Sort keys descending ("2026-07" before "2026-06")
        const sortedKeys = Object.keys(stats).sort().reverse();
        
        return sortedKeys.map(key => {
            const [year, monthStr] = key.split('-');
            const monthIndex = parseInt(monthStr, 10) - 1;
            const date = new Date(year, monthIndex, 1);
            const formattedLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            return {
                label: formattedLabel,
                amount: stats[key]
            };
        });
    }, [items]);

    return (
        <div className="space-y-6 pb-10">
            <div className="glass-panel rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-400/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-400/20 rounded-full blur-2xl"></div>
                
                <p className="text-slate-500 font-semibold mb-2 relative z-10 uppercase tracking-wider text-sm">Total Estimated Cost</p>
                <h2 className="text-5xl font-black text-slate-800 tracking-tight relative z-10">
                    ฿{grandTotal.toLocaleString()}
                </h2>
            </div>

            {chartData.length > 0 ? (
                <div className="glass-panel rounded-3xl p-6">
                    <h3 className="font-bold text-slate-800 mb-6 text-lg">Breakdown by Category</h3>
                    <div className="h-56 mb-8 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => `฿${value.toLocaleString()}`}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-3">
                        {['Need', 'Normal', 'Want'].map(cat => (
                            <div key={cat} className="flex justify-between items-center p-4 rounded-2xl bg-white/60 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[cat] }}></div>
                                    <span className="font-bold text-slate-700">{cat}</span>
                                </div>
                                <span className="font-black text-slate-800 text-lg">฿{totals[cat].toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center p-10 text-slate-400 glass-panel rounded-3xl border border-dashed border-slate-300">
                    No active wishes to summarize yet.
                </div>
            )}

            {monthlyStats.length > 0 && (
                <div className="glass-panel rounded-3xl p-6">
                    <h3 className="font-bold text-slate-800 mb-6 text-lg">Purchase History</h3>
                    <div className="space-y-3">
                        {monthlyStats.map(stat => (
                            <div key={stat.label} className="flex justify-between items-center p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/60 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm animate-pulse"></div>
                                    <span className="font-bold text-slate-700">{stat.label}</span>
                                </div>
                                <span className="font-black text-emerald-700 text-lg">฿{stat.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Send Notification Trigger (GAS) */}
            <div className="pt-4 flex justify-center">
                <button
                    onClick={() => {
                        const scriptUrl = localStorage.getItem('google_script_url');
                        if (!scriptUrl) {
                            alert('Google Apps Script URL not set in Settings.');
                            return;
                        }
                        fetch(scriptUrl, { method: 'GET' })
                            .then(res => res.text())
                            .then(text => alert('Notification Sent! Response: ' + text))
                            .catch(err => {
                                console.error(err);
                                alert('Error triggering Google Apps Script: ' + err.message);
                            });
                    }}
                    className="w-full max-w-xs px-5 py-3.5 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-500/25"
                >
                    Send Notification Now
                </button>
            </div>
        </div>
    );
}
