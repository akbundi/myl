
import React from 'react';

const Navbar: React.FC<{ onNavigate: (page: string) => void, currentPage: string, hasDnaResult: boolean }> = ({ onNavigate, currentPage, hasDnaResult }) => {
  const isDnaSection = currentPage === 'profile' || currentPage === 'recommendations';
  
  const navItems = [
    { id: 'discover', label: 'Discover' },
    { id: 'scanner', label: 'Scanner' },
    { id: hasDnaResult ? 'recommendations' : 'profile', label: 'DNA Profile' },
    { id: 'premium', label: 'Black' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <div className="glass rounded-full px-8 py-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-2xl">
        {navItems.map((item) => {
          const isActive = currentPage === item.id || (item.id === (hasDnaResult ? 'recommendations' : 'profile') && isDnaSection);
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-luxe-gold' : 'text-white/40'
              }`}
            >
              <span className={`text-[9px] uppercase tracking-widest font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label.split(' ')[0]}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-luxe-gold shadow-[0_0_5px_rgba(212,175,55,1)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
