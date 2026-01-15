import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import Header from './components/Header';
import QuickLog from './components/QuickLog';
import Timeline from './components/Timeline';
import Dashboard from './components/Dashboard';
import { LayoutList, PieChart as ChartIcon, Loader2 } from 'lucide-react';

export default function App() {
    const [user, setUser] = useState(null);
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('logs');
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Attempt anonymous login
        signInAnonymously(auth)
            .catch((error) => {
                console.error("Authentication Error:", error);
                setAuthError(error.message);
                setLoading(false);
            });

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Real-time listener for logs
                // Path: /artifacts/workpulse-365/users/{uid}/worklogs
                const logsRef = collection(db, 'artifacts', 'workpulse-365', 'users', currentUser.uid, 'worklogs');
                const q = query(logsRef, orderBy('date', 'desc'), orderBy('createdAt', 'desc'));

                const unsubSnapshot = onSnapshot(q, (snapshot) => {
                    const logsData = snapshot.docs.map(doc => {
                        const data = doc.data();

                        // Helper to convert Firestore Timestamp to standard format
                        const convertDate = (val) => {
                            if (!val) return null;
                            // If it's a Firestore Timestamp (has toDate method)
                            if (val && typeof val.toDate === 'function') {
                                return val.toDate().toISOString();
                            }
                            // If it's already a date object
                            if (val instanceof Date) {
                                return val.toISOString();
                            }
                            return val;
                        };

                        const safeString = (str, def = '') => {
                            if (typeof str === 'string') return str;
                            if (typeof str === 'number') return String(str);
                            return def;
                        };

                        return {
                            id: doc.id,
                            ...data,
                            // Aggressive sanitization to prevent rendering crashes
                            title: safeString(data.title, 'Untitled Log'),
                            category: safeString(data.category, 'General'),
                            application: safeString(data.application),
                            customer: safeString(data.customer),
                            impact: safeString(data.impact),
                            updateChannel: safeString(data.updateChannel, 'Chat'),

                            // Ensure dates are strings for React props
                            createdAt: convertDate(data.createdAt),
                            date: convertDate(data.date) || data.date || new Date().toISOString(), // Fallback to current date if absolutely missing
                            lastUpdateDate: convertDate(data.lastUpdateDate)
                        };
                    });
                    setLogs(logsData);
                    setLoading(false);
                }, (error) => {
                    console.error("Data Sync Error:", error);
                    // If it fails (e.g. permissions/offline), we might want to handle it
                    setLoading(false);
                });

                return () => unsubSnapshot();
            }
        });

        return () => unsubscribe();
    }, []);

    const handleAddLog = async (logData) => {
        if (!user) return;
        const logsRef = collection(db, 'artifacts', 'workpulse-365', 'users', user.uid, 'worklogs');
        await addDoc(logsRef, {
            ...logData,
            userId: user.uid,
            // Ensure month/year are stored for easy querying later if needed, though we parse date on read
            month: new Date(logData.date).toLocaleString('default', { month: 'short' })
        });
    };

    const handleDelete = async (id) => {
        if (!user) return;
        // Optimistic UI could be handled here or rely on snapshot
        const logRef = doc(db, 'artifacts', 'workpulse-365', 'users', user.uid, 'worklogs', id);
        await deleteDoc(logRef);
    };

    const handleUpdate = async (id, data) => {
        if (!user) return;
        const logRef = doc(db, 'artifacts', 'workpulse-365', 'users', user.uid, 'worklogs', id);
        await updateDoc(logRef, data);
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-24">
            <Header />

            <main className="max-w-md mx-auto p-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-10 opacity-50">
                        <Loader2 className="animate-spin text-dhl-red mb-2" size={32} />
                        <p>Loading WorkPulse...</p>
                    </div>
                ) : authError ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                        <h3 className="font-bold">Setup Required</h3>
                        <p className="text-sm mt-1">
                            Could not connect to Firebase. Please check <code>src/firebase.js</code> has valid API keys.
                        </p>
                        <pre className="text-xs mt-2 bg-white p-2 rounded border">{authError}</pre>
                    </div>
                ) : (
                    <>
                        {/* View Switcher is handled by Bottom Nav, but we render based on state */}
                        {activeTab === 'logs' && (
                            <div className="animate-in fade-in duration-300">
                                <QuickLog onAddLog={handleAddLog} />
                                <Timeline logs={logs} onDelete={handleDelete} onUpdate={handleUpdate} />
                            </div>
                        )}

                        {activeTab === 'stats' && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-2xl font-black text-slate-800 italic mb-6">
                                    Performance <span className="text-dhl-red">Insights</span>
                                </h2>
                                <Dashboard logs={logs} />
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg-up z-40 pb-safe">
                <div className="max-w-md mx-auto flex justify-around p-2">
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`flex flex-col items-center w-full p-2 rounded-lg transition-colors ${activeTab === 'logs' ? 'text-dhl-red' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <LayoutList size={24} strokeWidth={activeTab === 'logs' ? 2.5 : 2} />
                        <span className="text-xs font-medium mt-1">My Logs</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`flex flex-col items-center w-full p-2 rounded-lg transition-colors ${activeTab === 'stats' ? 'text-dhl-red' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <ChartIcon size={24} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
                        <span className="text-xs font-medium mt-1">Dashboard</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
