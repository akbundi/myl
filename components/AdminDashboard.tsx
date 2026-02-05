
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Role, BiometricProfile } from '../types';

// Mock User Data for Management
const MOCK_USERS: User[] = [
  { 
    id: 'usr_101', email: 'clara.v@luxe.fr', name: 'Clara Valmont', role: Role.USER, 
    sensorConsent: true, createdAt: '2024-01-12', 
    image: 'https://i.pravatar.cc/150?u=clara',
    biometricProfile: { facialGeometry: 'Diamond', microExpressions: 'Harmonious', skinTexture: 'Dewy', personalityArchetype: 'Solar Alchemist' }
  },
  { 
    id: 'usr_102', email: 'marcus.k@berlin.de', name: 'Marcus Kessler', role: Role.USER, 
    sensorConsent: true, createdAt: '2024-02-05', 
    image: 'https://i.pravatar.cc/150?u=marcus',
    biometricProfile: { facialGeometry: 'Square', microExpressions: 'Stoic', skinTexture: 'Matte', personalityArchetype: 'Obsidian Nomad' }
  },
  { 
    id: 'usr_103', email: 'yuki.s@tokyo.jp', name: 'Yuki Sato', role: Role.USER, 
    sensorConsent: true, createdAt: '2024-02-18', 
    image: 'https://i.pravatar.cc/150?u=yuki',
    biometricProfile: { facialGeometry: 'Oval', microExpressions: 'Dynamic', skinTexture: 'Balanced', personalityArchetype: 'Cyber Oud' }
  },
  { 
    id: 'usr_104', email: 'elena.r@milan.it', name: 'Elena Rossi', role: Role.USER, 
    sensorConsent: true, createdAt: '2024-03-01', 
    image: 'https://i.pravatar.cc/150?u=elena',
    biometricProfile: { facialGeometry: 'Heart', microExpressions: 'Warm', skinTexture: 'Radiant', personalityArchetype: 'Velvet Minimalist' }
  },
  { 
    id: 'usr_105', email: 'jean.p@luxe.fr', name: 'Jean Pierre', role: Role.USER, 
    sensorConsent: true, createdAt: '2024-03-10', 
    image: 'https://i.pravatar.cc/150?u=jean',
    biometricProfile: { facialGeometry: 'Square', microExpressions: 'Controlled', skinTexture: 'Rugged', personalityArchetype: 'Obsidian Nomad' }
  },
];

const ARCHETYPES = ['All', 'Solar Alchemist', 'Obsidian Nomad', 'Cyber Oud', 'Velvet Minimalist'];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intel' | 'users'>('intel');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suspendedUsers, setSuspendedUsers] = useState<Set<string>>(new Set());

  const stats = [
    { label: 'Active Archetypes', value: '4,281', trend: '+12%' },
    { label: 'Olfactive Scans/24h', value: '18.9k', trend: '+5.4%' },
    { label: 'Synthesis Conversions', value: '62%', trend: '+2.1%' },
  ];

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(u => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesArchetype = selectedArchetype === 'All' || u.biometricProfile?.personalityArchetype === selectedArchetype;
      
      return matchesSearch && matchesArchetype;
    });
  }, [searchQuery, selectedArchetype]);

  const toggleSuspension = (userId: string) => {
    const newSuspended = new Set(suspendedUsers);
    if (newSuspended.has(userId)) newSuspended.delete(userId);
    else newSuspended.add(userId);
    setSuspendedUsers(newSuspended);
  };

  return (
    <div className="max-w-7xl mx-auto px-12 pt-10 pb-20">
      {/* Admin Sub-Navigation */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="font-serif text-5xl mb-2 text-white">
            {activeTab === 'intel' ? 'Global Intelligence' : 'User Management'}
          </h1>
          <p className="text-luxe-gold uppercase tracking-[0.5em] text-[10px] font-bold">L’Oréal Luxe Command Center</p>
        </div>
        <div className="flex gap-2 glass p-1 rounded-full border-white/5">
          <button 
            onClick={() => setActiveTab('intel')}
            className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'intel' ? 'bg-luxe-gold text-black' : 'text-white/40 hover:text-white'}`}
          >
            Intel
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'users' ? 'bg-luxe-gold text-black' : 'text-white/40 hover:text-white'}`}
          >
            Users
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'intel' ? (
          <motion.div 
            key="intel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {stats.map((stat, i) => (
                <div 
                  key={i}
                  className="glass p-10 rounded-[40px] border-white/5 relative overflow-hidden group hover:border-luxe-gold/20"
                >
                  <div className="absolute top-0 right-0 p-8 text-[10px] font-bold text-luxe-gold">{stat.trend}</div>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-4">{stat.label}</p>
                  <h3 className="text-5xl font-serif text-white group-hover:text-luxe-gold transition-colors">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass p-12 rounded-[50px] border-white/5">
                <h3 className="font-serif text-2xl mb-10">Olfactive Market Dominance</h3>
                <div className="space-y-8">
                  {[
                    { name: 'Lavender (YSL Libre Base)', popularity: 88 },
                    { name: 'Blackcurrant (Armani Sì Core)', popularity: 74 },
                    { name: 'Amber Accord', popularity: 62 },
                    { name: 'Solar Jasmine', popularity: 51 },
                  ].map((accord, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-white/50">{accord.name}</span>
                        <span className="text-luxe-gold">{accord.popularity}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${accord.popularity}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className="h-full bg-luxe-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-12 rounded-[50px] border-white/5">
                <h3 className="font-serif text-2xl mb-10">Sensory Data Feed</h3>
                <div className="space-y-4">
                  {[
                    { id: '#882', archetype: 'Obsidian Nomad', location: 'Paris', timestamp: '2m ago' },
                    { id: '#881', archetype: 'Solar Alchemist', location: 'Tokyo', timestamp: '5m ago' },
                    { id: '#880', archetype: 'Cyber Oud', location: 'Dubai', timestamp: '8m ago' },
                  ].map((packet, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-luxe-gold/20 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-full bg-luxe-gold/10 flex items-center justify-center text-luxe-gold text-[10px] font-bold">
                          {packet.id}
                        </div>
                        <div>
                          <p className="text-xs font-medium group-hover:text-luxe-gold transition-colors">{packet.archetype}</p>
                          <p className="text-[9px] uppercase tracking-widest text-white/30">{packet.location}</p>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-white/20">{packet.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="space-y-6 mb-10">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20">🔍</span>
                  <input 
                    type="text" 
                    placeholder="SEARCH BY IDENTIFIER, NAME, OR EMAIL" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-10 py-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxe-gold transition-all"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mr-4">Filter by Archetype:</span>
                {ARCHETYPES.map(arch => (
                  <button
                    key={arch}
                    onClick={() => setSelectedArchetype(arch)}
                    className={`px-6 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold border transition-all ${
                      selectedArchetype === arch 
                        ? 'bg-luxe-gold border-luxe-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                        : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {arch}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-[40px] border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="border-b border-white/5">
                  <tr className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">
                    <th className="px-10 py-8">User Profile</th>
                    <th className="px-10 py-8">Archetype</th>
                    <th className="px-10 py-8">Connected Since</th>
                    <th className="px-10 py-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <img src={user.image} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{user.name}</p>
                                <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-white/40 font-mono">{user.id}</span>
                              </div>
                              <p className="text-[10px] text-white/30 tracking-wide uppercase">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-[10px] font-bold text-luxe-gold px-4 py-1.5 rounded-full bg-luxe-gold/10 border border-luxe-gold/20">
                            {user.biometricProfile?.personalityArchetype || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-[11px] text-white/40 font-mono tracking-tighter">
                          {user.createdAt}
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="px-5 py-2 glass rounded-full text-[9px] uppercase tracking-widest font-bold border-white/5 hover:border-luxe-gold transition-all"
                            >
                              Biometrics
                            </button>
                            <button 
                              onClick={() => toggleSuspension(user.id)}
                              className={`px-5 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all ${suspendedUsers.has(user.id) ? 'bg-red-500 text-white' : 'glass border-white/5 text-red-500/60 hover:text-red-500 hover:border-red-500/40'}`}
                            >
                              {suspendedUsers.has(user.id) ? 'Suspended' : 'Suspend'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center">
                        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em]">No identifiers match your selection</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Biometric Viewer Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass p-16 rounded-[60px] border-luxe-gold/20 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-10 right-10 w-12 h-12 glass rounded-full flex items-center justify-center text-white/40 hover:text-white border-white/10"
              >
                ✕
              </button>
              
              <div className="text-center mb-16">
                <p className="text-luxe-gold text-[10px] font-bold tracking-[0.5em] uppercase mb-4">Anonymized Sensory Logic</p>
                <h2 className="font-serif text-4xl italic">Profile #{selectedUser.id.split('_')[1]}</h2>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: 'Facial Geometry', value: selectedUser.biometricProfile?.facialGeometry, icon: '📐' },
                  { label: 'Micro Expressions', value: selectedUser.biometricProfile?.microExpressions, icon: '✨' },
                  { label: 'Skin Texture', value: selectedUser.biometricProfile?.skinTexture, icon: '🧴' },
                  { label: 'Olfactive Type', value: selectedUser.biometricProfile?.personalityArchetype, icon: '🧪' },
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-[30px] bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xl opacity-40">{item.icon}</span>
                      <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{item.label}</p>
                    </div>
                    <p className="text-lg font-serif italic text-white/90">{item.value || 'N/A'}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 italic">
                  End-to-End Encryption Active • No Raw Media Stored
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
