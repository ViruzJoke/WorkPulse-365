import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import Header from './components/Header';
import AddItem from './components/AddItem';
import Wishlist from './components/Wishlist';
import Summary from './components/Summary';
import Settings from './components/Settings';
import { PlusCircle, List, PieChart as ChartIcon, Loader2 } from 'lucide-react';

export default function App() {
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState('list'); // 'add', 'list', 'summary'
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        signInAnonymously(auth).catch((error) => {
            console.error("Auth Error:", error);
            setAuthError(error.message);
            setLoading(false);
        });

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const itemsRef = collection(db, 'artifacts', 'workpulse-365', 'users', currentUser.uid, 'wishlist');
                const q = query(itemsRef, orderBy('createdAt', 'desc'));

                const unsubSnapshot = onSnapshot(q, (snapshot) => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setItems(data);
                    setLoading(false);
                }, (error) => {
                    console.error("Data Sync Error:", error);
                    setLoading(false);
                });

                return () => unsubSnapshot();
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Line notification helper using a public CORS proxy (cors-anywhere style, e.g. corsproxy.io)
    const sendLineNotification = async (itemData) => {
        const token = localStorage.getItem('line_notify_token');
        if (!token) return;

        try {
            const message = `\n🌟 New Wishlist Item Added!\n\nName: ${itemData.title}\nCategory: ${itemData.category}\nPrice: ฿${itemData.price.toLocaleString()}`;
            
            // Using a public CORS proxy since direct fetch to line.me fails in browser
            const proxyUrl = "https://corsproxy.io/?";
            const targetUrl = "https://notify-api.line.me/api/notify";
            
            const formData = new URLSearchParams();
            formData.append('message', message);
            
            await fetch(proxyUrl + encodeURIComponent(targetUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            console.log("Line notification sent.");
        } catch (error) {
            console.error("Failed to send LINE notification:", error);
        }
    };

    const handleAdd = async (itemData) => {
        if (!user) return;
        const itemsRef = collection(db, 'artifacts', 'workpulse-365', 'users', user.uid, 'wishlist');
        await addDoc(itemsRef, {
            ...itemData,
            userId: user.uid
        });
        
        setActiveTab('list');
        sendLineNotification(itemData);
    };

    const handleDelete = async (id) => {
        if (!user) return;
        if (window.confirm("Are you sure you want to remove this item?")) {
            const itemRef = doc(db, 'artifacts', 'workpulse-365', 'users', user.uid, 'wishlist', id);
            await deleteDoc(itemRef);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-100/40 to-transparent pointer-events-none z-0"></div>
            
            <Header onSettingsClick={() => setShowSettings(true)} />

            {showSettings && <Settings onClose={() => setShowSettings(false)} />}

            <main className="max-w-md mx-auto p-4 relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 opacity-50">
                        <Loader2 className="animate-spin text-brand-500 mb-3" size={36} />
                        <p className="text-slate-500 font-medium tracking-wide">Loading Wishlist...</p>
                    </div>
                ) : !user ? (
                    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-sm border mt-10">
                        <h2 className="text-xl font-bold mb-6">Welcome</h2>
                        <button 
                            onClick={handleGoogleSignIn}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition"
                        >
                            Sign in with Google
                        </button>
                    </div>
                ) : authError ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-lg">Connection Error</h3>
                        <p className="text-sm mt-2 opacity-80">
                            Could not connect to Firebase. Please check your config.
                        </p>
                        <pre className="text-xs mt-4 bg-white p-3 rounded-lg border overflow-x-auto">{authError}</pre>
                    </div>
                ) : (
                    <>
                        {activeTab === 'add' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <AddItem onAdd={handleAdd} />
                            </div>
                        )}

                        {activeTab === 'list' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h2 className="text-xl font-bold text-slate-800">My Items</h2>
                                    <span className="text-sm font-semibold bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100 text-slate-500">
                                        {items.length} total
                                    </span>
                                </div>
                                <Wishlist items={items} onDelete={handleDelete} />
                            </div>
                        )}

                        {activeTab === 'summary' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">Dashboard</h2>
                                <Summary items={items} />
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Bottom Navigation */}
            {user && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 pb-safe">
                    <div className="max-w-md mx-auto flex justify-between p-2 px-6">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`flex flex-col items-center p-2 px-4 rounded-xl transition-all duration-300 ${activeTab === 'list' ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={24} strokeWidth={activeTab === 'list' ? 2.5 : 2} />
                            <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">List</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('add')}
                            className={`flex flex-col items-center p-3 px-5 rounded-2xl transition-all duration-300 transform -translate-y-4 shadow-lg ${activeTab === 'add' ? 'bg-brand-600 text-white shadow-brand-500/40' : 'bg-slate-800 text-white hover:bg-slate-700 shadow-slate-500/20'}`}
                        >
                            <PlusCircle size={28} strokeWidth={2.5} />
                        </button>

                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`flex flex-col items-center p-2 px-4 rounded-xl transition-all duration-300 ${activeTab === 'summary' ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <ChartIcon size={24} strokeWidth={activeTab === 'summary' ? 2.5 : 2} />
                            <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Summary</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}
