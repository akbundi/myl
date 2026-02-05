
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import BiometricScan from './components/BiometricScan';
import AdminDashboard from './components/AdminDashboard';
import MarketInsights from './components/MarketInsights';
import Discover from './components/Discover';
import { generateScentDNA, getRecipeRecommendations } from './services/gemini';
import { detectFragranceFromImage } from './services/vision';
import { User, Fragrance, Role } from './types';

// Official L’Oréal Luxe Fragrance Database
const LUXE_FRAGRANCE_DB: Fragrance[] = [
  { id: 'ysl-libre', brand: 'YSL Beauty', name: 'Libre', notes: ['Lavender', 'Orange Blossom', 'Musk'], family: 'Floral', priceEUR: 120, isActive: true, imageUrl: 'https://images.unsplash.com/photo-1541604193435-225878996233?auto=format&fit=crop&q=80&w=800' },
  { id: 'armani-si', brand: 'Giorgio Armani', name: 'Sì', notes: ['Blackcurrant', 'Rose', 'Vanilla'], family: 'Chypre Floral', priceEUR: 115, isActive: true, imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800' },
  { id: 'lancome-lvb', brand: 'Lancôme', name: 'La Vie Est Belle', notes: ['Iris', 'Patchouli', 'Gourmand Accord'], family: 'Floral Fruit', priceEUR: 110, isActive: true, imageUrl: 'https://images.unsplash.com/photo-1583445095369-9c651e7e5d30?auto=format&fit=crop&q=80&w=800' },
  { id: 'prada-para', brand: 'Prada', name: 'Paradoxe', notes: ['Neroli', 'Amber', 'Musk'], family: 'Floral', priceEUR: 130, isActive: true, imageUrl: 'https://images.unsplash.com/photo-1615037512866-4874c34094e1?auto=format&fit=crop&q=80&w=800' },
  { id: 'mugler-alien', brand: 'Mugler', name: 'Alien', notes: ['Jasmine', 'Cashmeran', 'Amber'], family: 'Woody Floral', priceEUR: 105, isActive: true, imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800' },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [dnaResult, setDnaResult] = useState<string | null>(null);
  const [ownedFragrances, setOwnedFragrances] = useState<Fragrance[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [theme, setTheme] = useState<'gold' | 'navy'>('gold');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginRole, setLoginRole] = useState<Role>(Role.USER);
  const [scannedResult, setScannedResult] = useState<Fragrance | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('pulse_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedDna = localStorage.getItem('pulse_dna');
    if (storedDna) setDnaResult(storedDna);
  }, []);

  const handleAuthSuccess = () => {
    const newUser: User = {
      id: loginRole === Role.ADMIN ? 'adm_001' : 'usr_123',
      email: loginEmail || 'innovator@loreal.com',
      name: loginRole === Role.ADMIN ? 'Admin Architect' : 'Julian de Luxe',
      image: loginRole === Role.ADMIN ? 'https://i.pravatar.cc/150?u=admin' : 'https://i.pravatar.cc/150?u=luxe123',
      role: loginRole,
      sensorConsent: true,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('pulse_user', JSON.stringify(newUser));
    setCurrentPage('landing');
  };

  const handleLogout = () => {
    setUser(null);
    setDnaResult(null);
    localStorage.removeItem('pulse_user');
    localStorage.removeItem('pulse_dna');
    setCurrentPage('landing');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'gold' ? 'navy' : 'gold';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleScanComplete = async (data: any) => {
    const result = await generateScentDNA(data.biometrics, data.behavior, data.voice);
    setDnaResult(result);
    localStorage.setItem('pulse_dna', result);
    setCurrentPage('recommendations');
  };

  const handleFragranceDetection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const detected = await detectFragranceFromImage(base64);
      const match = LUXE_FRAGRANCE_DB.find(f => f.name.toLowerCase().includes(detected.name.toLowerCase()));
      setScannedResult(match ? { ...match } : { id: 'custom', brand: detected.brand, name: detected.name, notes: ['Vibrant', 'Fresh'], family: 'Modern', priceEUR: 0, isActive: true });
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-luxe-black text-white font-sans selection:bg-luxe-gold/30">
      <Header 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        user={user} 
        onLogin={() => setCurrentPage('login')}
        onLogout={handleLogout}
        hasDnaResult={!!dnaResult}
        currentTheme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="pt-24 pb-32 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentPage === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 text-center">
              <h1 className="font-serif text-6xl md:text-8xl mb-6 tracking-tighter">Decode your <br /><span className="text-luxe-gold italic">Essence.</span></h1>
              <p className="text-white/40 max-w-lg mx-auto mb-12 uppercase tracking-[0.3em] text-[10px] leading-relaxed">Passive biometric profiling for the modern connoisseur. L’Oréal Luxe Innovation Lab.</p>
              <button 
                onClick={() => {
                   if (!user) setCurrentPage('login');
                   else if (user.role === Role.ADMIN) setCurrentPage('admin-dashboard');
                   else setCurrentPage(dnaResult ? 'recommendations' : 'profile');
                }}
                className="px-12 py-5 gold-gradient rounded-full text-black font-extrabold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
              >
                {!user ? 'Begin Identity Check' : (user.role === Role.ADMIN ? 'Enter Command Center' : 'Enter the Lab')}
              </button>
            </motion.div>
          )}

          {currentPage === 'discover' && (
            <motion.div key="discover" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
              <Discover 
                fragrances={LUXE_FRAGRANCE_DB} 
                onSelect={(f) => {
                  setScannedResult(f);
                  setCurrentPage('scanner');
                }} 
              />
            </motion.div>
          )}

          {currentPage === 'scanner' && (
             <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 w-full">
                <h2 className="font-serif text-4xl mb-12 text-center italic">Fragrance Archive</h2>
                <div className="glass p-10 rounded-[40px] border-dashed border-2 border-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-luxe-gold/40 transition-all">
                  <input type="file" className="hidden" id="bottle-scan" onChange={handleFragranceDetection} />
                  <label htmlFor="bottle-scan" className="text-center cursor-pointer">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 mx-auto"><span className="text-2xl opacity-30">📸</span></div>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Upload Bottle Geometry</span>
                  </label>
                </div>
                {isScanning && <div className="mt-8 text-center text-luxe-gold animate-pulse text-[10px] uppercase tracking-widest font-bold">Synthesizing...</div>}
                {scannedResult && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 glass p-8 rounded-[30px] flex gap-8 items-center border-luxe-gold/30">
                    <div className="w-32 h-32 bg-white/5 rounded-2xl flex items-center justify-center text-4xl">🧴</div>
                    <div>
                      <p className="text-luxe-gold text-[10px] font-bold tracking-widest uppercase mb-1">{scannedResult.brand}</p>
                      <h3 className="font-serif text-3xl mb-4">{scannedResult.name}</h3>
                      <button onClick={() => { setOwnedFragrances([...ownedFragrances, scannedResult]); setScannedResult(null); }} className="px-6 py-2 gold-gradient rounded-full text-black text-[10px] font-extrabold uppercase tracking-widest">Add to Wardrobe</button>
                    </div>
                  </motion.div>
                )}
             </motion.div>
          )}

          {currentPage === 'admin-dashboard' && user?.role === Role.ADMIN && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <AdminDashboard />
            </motion.div>
          )}

          {currentPage === 'market-insights' && user?.role === Role.ADMIN && (
            <motion.div key="insights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <MarketInsights />
            </motion.div>
          )}

          {currentPage === 'login' && (
             <motion.div key="login" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full mx-auto px-6">
                <div className="glass p-12 rounded-[50px] border-white/10 text-center">
                   <h2 className="font-serif text-4xl mb-2 italic">Identify</h2>
                   <p className="text-[9px] text-luxe-gold uppercase tracking-[0.4em] font-bold mb-8">Accessing Sensory Cloud</p>
                   <div className="flex gap-4 mb-8 bg-white/5 p-1 rounded-full">
                      <button onClick={() => setLoginRole(Role.USER)} className={`flex-1 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${loginRole === Role.USER ? 'bg-luxe-gold text-black' : 'text-white/40'}`}>Client</button>
                      <button onClick={() => setLoginRole(Role.ADMIN)} className={`flex-1 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${loginRole === Role.ADMIN ? 'bg-luxe-gold text-black' : 'text-white/40'}`}>Admin</button>
                   </div>
                   <input type="email" placeholder="IDENTIFIER" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxe-gold transition-colors mb-12" />
                   <button onClick={handleAuthSuccess} className="w-full py-5 gold-gradient rounded-full text-black font-extrabold uppercase text-[10px] tracking-widest">Authorize {loginRole}</button>
                </div>
             </motion.div>
          )}

          {currentPage === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto px-6 w-full">
              <div className="text-center mb-16">
                <h2 className="font-serif text-4xl mb-4 text-white italic">DNA Initialization</h2>
                <p className="text-white/30 text-[9px] uppercase tracking-[0.5em] font-bold italic">Phase 1: Biometric Extraction</p>
              </div>
              <BiometricScan onComplete={handleScanComplete} />
            </motion.div>
          )}

          {currentPage === 'recommendations' && (
            <motion.div key="recommendations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 w-full">
               <div className="glass p-12 rounded-[50px] border-luxe-gold/20 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-luxe-gold opacity-30 shadow-[0_0_20px_rgba(212,175,55,1)]" />
                  <h3 className="text-luxe-gold text-[10px] font-bold tracking-widest mb-6 uppercase">Synthesis Logic Results</h3>
                  <h2 className="font-serif text-5xl mb-10 leading-tight italic">"{dnaResult || "Solar Alchemist"}"</h2>
                  <div className="h-px bg-white/10 w-full mb-10" />
                  <p className="text-sm text-white/40 leading-relaxed italic max-w-lg mx-auto">Based on your biometric profile and sensory context, we recommend a layering strategy that optimizes for thermal reactivity.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
