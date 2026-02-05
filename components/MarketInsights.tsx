
import React from 'react';
import { motion } from 'framer-motion';

const MarketInsights: React.FC = () => {
  const regions = [
    { city: 'PARIS', archetype: 'Velvet Minimalist', intensity: 92, trend: 'up' },
    { city: 'TOKYO', archetype: 'Solar Alchemist', intensity: 84, trend: 'up' },
    { city: 'DUBAI', archetype: 'Obsidian Nomad', intensity: 98, trend: 'stable' },
    { city: 'NEW YORK', archetype: 'Cyber Oud', intensity: 76, trend: 'down' },
  ];

  const predictiveTrends = [
    { note: 'Cold-Pressed Iris', probability: 89, sentiment: 'Positive' },
    { note: 'Molecular Saffron', probability: 72, sentiment: 'Niche' },
    { note: 'Synthetic Rain', probability: 64, sentiment: 'Emerging' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-12 pt-10 pb-20">
      <div className="mb-16">
        <h1 className="font-serif text-5xl mb-2 text-white italic">Olfactive Forecast</h1>
        <p className="text-luxe-gold uppercase tracking-[0.5em] text-[10px] font-bold">Predictive Intelligence • L’Oréal Luxe Lab</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Global Distribution Map Simulation */}
        <div className="lg:col-span-2 glass p-12 rounded-[60px] border-white/5 relative overflow-hidden h-[500px]">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-luxe-gold rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full blur-[120px]" />
          </div>
          
          <h3 className="font-serif text-2xl mb-2">Global Pulse</h3>
          <p className="text-[9px] uppercase tracking-widest text-white/30 mb-10">Real-time Synthesis Hubs</p>
          
          <div className="space-y-6 relative z-10">
            {regions.map((region, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-2 h-2 rounded-full bg-luxe-gold shadow-[0_0_10px_rgba(212,175,55,1)]" />
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase">{region.city}</p>
                    <p className="text-[10px] text-white/40">{region.archetype}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${region.intensity}%` }}
                      className="h-full bg-gradient-to-r from-luxe-gold to-white"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-luxe-gold">{region.intensity}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Predictive Trends */}
        <div className="glass p-12 rounded-[60px] border-white/5 flex flex-col">
          <h3 className="font-serif text-2xl mb-2">Ingredient Drift</h3>
          <p className="text-[9px] uppercase tracking-widest text-white/30 mb-10">AI-Generated Market Shift</p>
          
          <div className="flex-1 space-y-10">
            {predictiveTrends.map((trend, i) => (
              <div key={i} className="relative">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-sm font-serif italic mb-1">{trend.note}</p>
                    <p className="text-[9px] uppercase tracking-widest text-luxe-gold font-bold">{trend.sentiment}</p>
                  </div>
                  <span className="text-3xl font-serif text-white/10 group-hover:text-white/20 transition-colors">0{i+1}</span>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                <div className="mt-4 flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  <span>Probability</span>
                  <span>{trend.probability}%</span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-12 w-full py-5 gold-gradient rounded-full text-black font-extrabold uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
            Generate Q3 Strategy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Avg PH Reactivity', value: '4.8', sub: 'High Stability' },
          { label: 'Oud Saturation', value: '12%', sub: 'Declining' },
          { label: 'Solar Accords', value: '68%', sub: 'Trending North' },
          { label: 'Citrus Longevity', value: '+14m', sub: 'Optimized' },
        ].map((metric, i) => (
          <div key={i} className="glass p-8 rounded-[40px] border-white/5 text-center group hover:border-luxe-gold/30 transition-all">
            <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-4">{metric.label}</p>
            <h4 className="text-3xl font-serif text-white mb-1 group-hover:text-luxe-gold transition-colors">{metric.value}</h4>
            <p className="text-[9px] text-luxe-gold/40 italic">{metric.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketInsights;
