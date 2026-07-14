import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
    'Need': '#f43f5e', // accent-500
    'Normal': '#14b8a6', // brand-500
    'Want': '#94a3b8'  // slate-400
};

export default function Summary({ items }) {
    const { chartData, totals, grandTotal } = useMemo(() => {
        const catTotals = { Need: 0, Normal: 0, Want: 0 };
        
        items.forEach(item => {
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
                <div className="flex flex-col gap-2 mt-4 max-w-xs mx-auto">
                    <button
                        onClick={() => {
                            const scriptUrl = localStorage.getItem('google_script_url');
                            if (!scriptUrl) {
                                alert('Google Apps Script URL not set in Settings.');
                                return;
                            }
                            fetch(scriptUrl, { method: 'GET' })
                                .then(res => res.text())
                                .then(text => alert('Automation Triggered! Response: ' + text))
                                .catch(err => {
                                    console.error(err);
                                    alert('Error triggering Google Apps Script: ' + err.message);
                                });
                        }}
                        className="w-full px-4 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
                    >
                        Trigger Google Script
                    </button>
                </div>
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
                    No data to summarize yet.
                </div>
            )}
        </div>
    );
}
