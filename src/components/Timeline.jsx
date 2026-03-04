import React, { useState, useMemo } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
const CATEGORIES = ['Solution', 'Integration', 'Support', 'Meeting', 'Internal'];
const APPS = ['API', 'MyDHL+', 'DEC', 'DGF', 'eAlert', 'Other'];

const LogCard = ({ log, onDelete, onUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    // Update Log fields
    const [editImpact, setEditImpact] = useState(log.impact || '');
    const [lastUpdateDate, setLastUpdateDate] = useState(() => {
        if (!log.lastUpdateDate) return '';
        try {
            return log.lastUpdateDate.split('T')[0];
        } catch (e) {
            return '';
        }
    });
    const [updateChannel, setUpdateChannel] = useState(log.updateChannel || 'Chat');

    // Edit Info fields
    const [editTitle, setEditTitle] = useState(log.title);
    const [editCategory, setEditCategory] = useState(log.category || CATEGORIES[0]);
    const [editApplication, setEditApplication] = useState(log.application || APPS[1]);
    const [editCustomer, setEditCustomer] = useState(log.customer || '');
    const [editTargetMonth, setEditTargetMonth] = useState(log.targetMonth || '');

    const handleUpdateLog = (e) => {
        if (e) e.stopPropagation();
        onUpdate(log.id, {
            impact: editImpact,
            lastUpdateDate,
            updateChannel
        });
        setIsExpanded(false);
    };

    const handleSaveInfo = (e) => {
        if (e) e.stopPropagation();
        onUpdate(log.id, {
            title: editTitle,
            category: editCategory,
            application: editApplication,
            customer: editCustomer,
            targetMonth: editTargetMonth
        });
        setIsEditingInfo(false);
    };

    const setToday = (e) => {
        if (e) e.stopPropagation();
        setLastUpdateDate(new Date().toISOString().split('T')[0]);
    };

    if (isEditingInfo) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-md border-2 border-slate-800 space-y-3">
                <div className="text-xs text-slate-800 font-bold uppercase mb-2 border-b pb-2">Edit Task Info</div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Task Title</label>
                    <input
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800 focus:ring-2 focus:ring-dhl-yellow outline-none"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">Category</label>
                        <select
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-dhl-yellow text-slate-700"
                            value={editCategory}
                            onChange={e => setEditCategory(e.target.value)}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">Application</label>
                        <select
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-dhl-yellow text-slate-700"
                            value={editApplication}
                            onChange={e => setEditApplication(e.target.value)}
                        >
                            {APPS.map(app => (
                                <option key={app} value={app}>{app}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">Target Month</label>
                        <input
                            type="month"
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-dhl-yellow text-slate-700"
                            value={editTargetMonth}
                            onChange={e => setEditTargetMonth(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">Customer</label>
                        <input
                            type="text"
                            placeholder="e.g. K.Somsak"
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-dhl-yellow text-slate-700"
                            value={editCustomer}
                            onChange={e => setEditCustomer(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t mt-4">
                    <button onClick={(e) => { e.stopPropagation(); setIsEditingInfo(false); }} className="px-3 py-1.5 text-slate-500 text-sm hover:bg-slate-100 rounded font-medium">Cancel</button>
                    <button onClick={handleSaveInfo} className="px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors">Save Task Info</button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => !isExpanded && setIsExpanded(true)}
            className={`bg-white p-4 rounded-xl shadow-sm border transition-all relative ${isExpanded ? 'border-dhl-yellow ring-2 ring-yellow-100' : 'border-slate-100 hover:shadow-md cursor-pointer'}`}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-dhl-red uppercase mb-1">
                        <span className="bg-red-50 px-2 py-0.5 rounded-full">{log.category}</span>
                        {log.application && <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">{log.application}</span>}

                        {log.lastUpdateDate && !isExpanded && (
                            <span className="flex items-center gap-1 text-slate-500 normal-case ml-auto sm:ml-0 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">
                                <span className={`w-2 h-2 rounded-full ${log.updateChannel === 'Email' ? 'bg-blue-400' : log.updateChannel === 'Phone' ? 'bg-green-400' : 'bg-purple-400'}`}></span>
                                {(() => {
                                    try {
                                        return new Date(log.lastUpdateDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                                    } catch (e) {
                                        return 'Invalid Date';
                                    }
                                })()}
                            </span>
                        )}
                    </div>
                    <h4 className="text-slate-800 font-medium text-lg md:text-xl leading-tight mb-2">
                        {log.title}
                    </h4>
                    {log.customer && <div className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1 mb-2"><span className="w-1 h-1 bg-slate-400 rounded-full"></span> {log.customer}</div>}

                    {!isExpanded && log.impact && (
                        <div className="text-slate-500 text-sm bg-slate-50 p-2 rounded-lg italic line-clamp-2 mt-2">
                            "{log.impact}"
                        </div>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-3">
                        <div className="text-sm font-bold text-dhl-red uppercase flex items-center gap-1">
                            <Edit2 size={14} /> Update Log
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1 bg-slate-100 rounded">Close</button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400">Latest Update Date</label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    className="flex-1 p-2 bg-slate-50 border rounded text-sm outline-none focus:ring-1 focus:ring-dhl-yellow"
                                    value={lastUpdateDate}
                                    onChange={e => setLastUpdateDate(e.target.value)}
                                />
                                <button type="button" onClick={setToday} className="bg-slate-200 px-3 rounded text-xs font-bold hover:bg-dhl-yellow hover:text-dhl-red transition-colors">Today</button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400">Update Channel</label>
                            <div className="flex gap-2 items-center">
                                {['Chat', 'Phone', 'Email'].map(ch => (
                                    <button
                                        key={ch}
                                        onClick={(e) => { e.stopPropagation(); setUpdateChannel(ch); }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${updateChannel === ch ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        {ch}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400">Log Details</label>
                            <textarea
                                className="w-full p-2 bg-slate-50 border rounded text-sm min-h-[80px] focus:ring-2 focus:ring-dhl-yellow outline-none"
                                value={editImpact}
                                onChange={e => setEditImpact(e.target.value)}
                                placeholder="What's the update?"
                            />
                        </div>

                        <button
                            onClick={handleUpdateLog}
                            className="w-full py-2.5 bg-dhl-yellow text-slate-800 rounded-lg text-sm font-bold shadow-sm hover:bg-yellow-400 transition-colors mt-2"
                        >
                            Save Update
                        </button>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 mt-6 pt-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsEditingInfo(true); }}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 shadow-sm"
                        >
                            <Edit2 size={16} /> Edit Task Info
                        </button>

                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this task?')) {
                                        onDelete(log.id);
                                    }
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                            >
                                <Trash2 size={16} /> Delete Task
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Timeline({ logs, onDelete, onUpdate }) {
    const groupedLogs = useMemo(() => {
        const groups = {};
        logs.forEach(log => {
            try {
                if (!log.date) throw new Error('No date');
                const date = new Date(log.date);
                if (isNaN(date.getTime())) throw new Error('Invalid date'); // Check for Invalid Date

                const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                if (!groups[monthYear]) groups[monthYear] = [];
                groups[monthYear].push(log);
            } catch (err) {
                // Fallback for logs with missing/invalid dates
                const fallbackKey = 'Recent / Unsorted';
                if (!groups[fallbackKey]) groups[fallbackKey] = [];
                groups[fallbackKey].push(log);
            }
        });

        return Object.entries(groups).sort((a, b) => {
            // Keep 'Recent / Unsorted' at the top or handling specific sorting
            if (a[0] === 'Recent / Unsorted') return -1;
            if (b[0] === 'Recent / Unsorted') return 1;
            return new Date(b[0]) - new Date(a[0]);
        });
    }, [logs]);

    if (logs.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <p>No logs yet. Start by adding one above!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {groupedLogs.map(([month, monthLogs]) => (
                <div key={month} className="animate-in fade-in duration-500">
                    <h3 className="text-lg font-bold text-slate-500 mb-4 sticky top-20 bg-slate-100/90 backdrop-blur-sm py-2 z-10">
                        {month}
                    </h3>
                    <div className="space-y-4">
                        {monthLogs.sort((a, b) => {
                            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                            return dateB - dateA;
                        }).map((log) => (
                            <LogCard key={log.id} log={log} onDelete={onDelete} onUpdate={onUpdate} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
