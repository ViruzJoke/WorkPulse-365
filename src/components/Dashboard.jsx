import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Award, TrendingUp } from 'lucide-react';

const COLORS = ['#D40511', '#FFCC00', '#FF9900', '#CC0000', '#990000'];

export default function Dashboard({ logs }) {
    const stats = useMemo(() => {
        const total = logs.length;

        // Monthly
        const monthlyData = {};
        logs.forEach(log => {
            const month = new Date(log.date).toLocaleString('default', { month: 'short' });
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });
        const monthlyChartData = Object.entries(monthlyData).map(([name, value]) => ({ name, value }));

        // Category
        const categoryData = {};
        logs.forEach(log => {
            categoryData[log.category] = (categoryData[log.category] || 0) + 1;
        });
        const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

        return { total, monthlyChartData, categoryChartData };
    }, [logs]);

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-dhl-red to-red-700 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center gap-2 opacity-80 mb-1">
                        <Award size={18} />
                        <span className="text-xs font-bold uppercase">Total Logs</span>
                    </div>
                    <div className="text-4xl font-black">{stats.total}</div>
                    <div className="text-xs opacity-70 mt-1">Year to Date</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 text-dhl-red mb-1">
                        <TrendingUp size={18} />
                        <span className="text-xs font-bold uppercase">Run Rate</span>
                    </div>
                    <div className="text-4xl font-black text-slate-800">
                        {Math.round(stats.total / (new Date().getMonth() + 1))}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Logs / Month (Avg)</div>
                </div>
            </div>

            {/* Charts */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Activity Volume</h3>
                <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.monthlyChartData}>
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="value" fill="#FFCC00" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Breakdown</h3>
                <div className="h-40 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.categoryChartData}
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {stats.categoryChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="text-xs text-slate-400 max-w-[40%]">
                        <ul className="space-y-1">
                            {stats.categoryChartData.map((d, i) => (
                                <li key={d.name} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></span>
                                    {d.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
