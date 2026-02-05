
import React from 'react';
import { motion } from 'framer-motion';
import { Fragrance } from '../types';

interface DiscoverProps {
  fragrances: Fragrance[];
  onSelect: (f: Fragrance) => void;
}

const Discover: React.FC<DiscoverProps> = ({ fragrances, onSelect }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-16 text-center">
        <h2 className="font-serif text-5xl mb-4 text-white italic">The Portfolio</h2>
        <p className="text-luxe-gold uppercase tracking-[0.5em] text-[10px] font-bold">L’Oréal Luxe Curated Selection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {fragrances.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(f)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[40px] glass border-white/5 mb-6 group-hover:border-luxe-gold/30 transition-all duration-700">
              <img 
                src={f.imageUrl} 
                alt={f.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-luxe-gold text-[10px] font-bold tracking-[0.4em] uppercase mb-1">{f.brand}</p>
                <h3 className="font-serif text-3xl text-white">{f.name}</h3>
              </div>
            </div>
            
            <div className="flex items-center justify-between px-2">
              <div className="flex gap-2">
                {f.notes.slice(0, 2).map((note, idx) => (
                  <span key={idx} className="text-[9px] uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1 rounded-full italic">
                    {note}
                  </span>
                ))}
              </div>
              <span className="text-[11px] font-mono text-luxe-gold/60 italic">€{f.priceEUR}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
