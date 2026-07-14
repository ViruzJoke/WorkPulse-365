import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
  const [quickBuyThreshold, setQuickBuyThreshold] = useState('');
  const [currentMode, setCurrentMode] = useState('Personal');

  // ---------- Google Sign‑In ----------
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google sign‑in error:', error);
      setAuthError(error.message);
    }
  };

  // Listen for auth state changes – no auto sign‑in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const itemsRef = collection(db, 'artifacts', 'mywishlist-9ba95', 'users', currentUser.uid, 'wishlist');
        const q = query(itemsRef, orderBy('createdAt', 'desc'));
        const unsubSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setItems(data);
            setLoading(false);
          },
          (error) => {
            console.error('Data Sync Error:', error);
            setLoading(false);
          }
        );
        return () => unsubSnapshot();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    // Load quick buy threshold and mode from localStorage once on mount
    const storedThreshold = localStorage.getItem('quick_buy_threshold');
    if (storedThreshold) setQuickBuyThreshold(storedThreshold);
    const storedMode = localStorage.getItem('wishlist_mode');
    if (storedMode) setCurrentMode(storedMode);
    return () => unsubscribe();
  }, []);

  // -------------------------------------------------
  const handleAdd = async (itemData) => {
    if (!user) return;
    const itemsRef = collection(db, 'artifacts', 'mywishlist-9ba95', 'users', user.uid, 'wishlist');
    await addDoc(itemsRef, { ...itemData, userId: user.uid });
    setActiveTab('list');
  };

  // Sign‑out handler
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    // optional: clear any stored tokens (e.g., LINE Notify)
    localStorage.removeItem('line_notify_token');
  };

  const handleDelete = async (id) => {
    if (!user) return;
    if (window.confirm('Are you sure you want to remove this item?')) {
      const itemRef = doc(db, 'artifacts', 'mywishlist-9ba95', 'users', user.uid, 'wishlist', id);
      await deleteDoc(itemRef);
    }
  };

  const handleEdit = async (id, updatedData) => {
    if (!user) return;
    const itemRef = doc(db, 'artifacts', 'mywishlist-9ba95', 'users', user.uid, 'wishlist', id);
    await updateDoc(itemRef, updatedData);
  };

  const handleArchive = async (id) => {
    if (!user) return;
    const itemRef = doc(db, 'artifacts', 'mywishlist-9ba95', 'users', user.uid, 'wishlist', id);
    const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    await updateDoc(itemRef, {
      bought: true,
      boughtDate: todayStr
    });
  };

  // Update quick buy threshold in real time
  const handleThresholdChange = (value) => {
    setQuickBuyThreshold(value);
    localStorage.setItem('quick_buy_threshold', value);
  };

  // Handle mode change from Settings
  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    localStorage.setItem('wishlist_mode', mode);
  };

  // Undo a purchase (move back to active wishlist)
  const handleRedo = async (id) => {
    if (!user) return;
    const itemRef = doc(db, 'artifacts', 'mywishlist-9ba95', 'users', user.uid, 'wishlist', id);
    await updateDoc(itemRef, { bought: false, boughtDate: null });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-100/40 to-transparent pointer-events-none z-0"></div>

      <Header onSettingsClick={() => setShowSettings(true)} user={user} onSignOut={handleSignOut} />

      {showSettings && <Settings onClose={() => setShowSettings(false)} onThresholdChange={handleThresholdChange} onModeChange={handleModeChange} />}

      <main className="max-w-md mx-auto p-4 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 opacity-50">
            <Loader2 className="animate-spin text-brand-500 mb-3" size={36} />
            <p className="text-slate-500 font-medium tracking-wide">Loading Wishlist...</p>
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center py-20">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2 bg-brand-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-brand-700 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                <path fill="#EA4335" d="M24 9.5c3.45 0 6.57 1.18 9 3.13l6.73-6.73C36.88 2.68 30.78 0 24 0 14.62 0 6.55 5.12 2.42 12.5l7.9 6.13C12.73 13.71 17.92 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24c0-1.6-.15-3.13-.44-4.6H24v9.2h12.62c-.55 2.96-2.2 5.47-4.68 7.15l7.13 5.55c4.16-3.86 6.55-9.55 6.55-16.3z"/>
                <path fill="#FBBC05" d="M13.32 28.63A13.97 13.97 0 0 1 12.5 24c0-1.5.27-2.94.78-4.27l-7.9-6.13A23.73 23.73 0 0 0 0 24c0 3.84 1 7.5 2.77 10.73l7.55-5.1z"/>
                <path fill="#34A853" d="M24 48c6.78 0 12.88-2.25 17.2-6.1l-7.13-5.55c-2.37 1.59-5.4 2.5-8.57 2.5-6.08 0-11.27-4.21-13.1-9.85l-7.55 5.1C6.55 42.88 14.62 48 24 48z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        ) : authError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg">Connection Error</h3>
            <p className="text-sm mt-2 opacity-80">Could not connect to Firebase. Please check your config.</p>
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
                    {items.filter(item => !item.bought).length} total
                  </span>
                </div>
                <Wishlist 
                  items={items} 
                  onDelete={handleDelete} 
                  onEdit={handleEdit} 
                  onArchive={handleArchive}
                  onRedo={handleRedo}
                  quickBuyThreshold={quickBuyThreshold}
                  currentMode={currentMode}
                />
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

      {/* Bottom Navigation – only visible when logged in */}
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
