import React, { useState, useMemo } from 'react';
import { Trash2, Edit2, Calendar } from 'lucide-react';

const LogCard = ({ log, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(log.title);
    const [editImpact, setEditImpact] = useState(log.impact);

    // New Fields
    // safely extract YYYY-MM-DD from ISO string or use existing date string
    const [lastUpdateDate, setLastUpdateDate] = useState(() => {
        if (!log.lastUpdateDate) return '';
        try {
            return log.lastUpdateDate.split('T')[0];
        } catch (e) {
            return '';
        }
    });
    const [updateChannel, setUpdateChannel] = useState(log.updateChannel || 'Chat');

    const handleSave = () => {
        onUpdate(log.id, {
            title: editTitle,
            impact: editImpact,
            lastUpdateDate,
            updateChannel
        });
        setIsEditing(false);
    };

    const setToday = () => {
        setLastUpdateDate(new Date().toISOString().split('T')[0]);
    };

    if (isEditing) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-md border-2 border-dhl-yellow space-y-3">
                <div className="text-xs text-dhl-red font-bold uppercase mb-1">Editing Log</div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Task Title</label>
                    <input
                        className="w-full p-2 bg-slate-50 border rounded font-semibold text-slate-800 focus:ring-2 focus:ring-dhl-yellow outline-none"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Latest Update</label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="flex-1 p-2 bg-slate-50 border rounded text-sm outline-none"
                            value={lastUpdateDate}
                            onChange={e => setLastUpdateDate(e.target.value)}
                        />
                        <button type="button" onClick={setToday} className="bg-slate-200 px-3 rounded text-xs font-bold hover:bg-dhl-yellow hover:text-dhl-red transition-colors">Today</button>
                    </div>
                    <div className="flex gap-2 items-center mt-2">
                        <span className="text-xs text-slate-500">Via:</span>
                        {['Chat', 'Phone', 'Email'].map(ch => (
                            <button
                                key={ch}
                                onClick={() => setUpdateChannel(ch)}
                                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${updateChannel === ch ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}
                            >
                                {ch}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Impact / Description</label>
                    <textarea
                        className="w-full p-2 bg-slate-50 border rounded text-sm min-h-[60px] focus:ring-2 focus:ring-dhl-yellow outline-none"
                        value={editImpact}
                        onChange={e => setEditImpact(e.target.value)}
                        placeholder="Impact..."
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-slate-500 text-sm hover:bg-slate-100 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-3 py-1 bg-dhl-red text-white rounded text-sm font-bold shadow-sm hover:bg-red-700">Save Changes</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-dhl-red uppercase mb-1">
                        <span className="bg-red-50 px-2 py-0.5 rounded-full">{log.category}</span>
                        {log.application && <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">{log.application}</span>}

                        {log.lastUpdateDate && (
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

                    {log.impact && (
                        <p className="text-slate-500 text-sm bg-slate-50 p-2 rounded-lg italic">
                            "{log.impact}"
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2">
                    {onUpdate && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-300 hover:text-dhl-yellow transition-colors hover:bg-slate-50 rounded-full"
                            title="Edit log"
                        >
                            <Edit2 size={16} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(log.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full"
                            title="Delete log"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Timeline({ logs, onDelete, onUpdate }) {
    const groupedLogs = useMemo(() => {
        const groups = {};
        logs.forEach(log => {
            const date = new Date(log.date);
            const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            if (!groups[monthYear]) groups[monthYear] = [];
            groups[monthYear].push(log);
        });
        return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
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
                        {monthLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((log) => (
                            <LogCard key={log.id} log={log} onDelete={onDelete} onUpdate={onUpdate} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
