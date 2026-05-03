import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { getDemoPooling, getDemoBackhaul } from '../services/api';
import SetuPointMap from './SetuPointMap';
import CountUp from 'react-countup';
import {
  Fuel, TrendingUp, Truck, MapPin, Package, ScanLine,
  ArrowRight, Users, Route, IndianRupee, Zap, CheckCircle2
} from 'lucide-react';

export default function SarathiDashboard() {
  const { t, language, poolingData, setPoolingData, backhaulData, setBackhaulData, userName,
    liveRequests, acceptRequest, completeRequest } = useApp();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('routes');
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [pool, haul] = await Promise.all([getDemoPooling(), getDemoBackhaul()]);
      if (pool) setPoolingData(pool);
      if (haul) setBackhaulData(haul);
      setLoading(false);
    }
    loadData();
  }, []);

  const fuelSaved = poolingData ? (poolingData.total_distance_saved_km * 0.35).toFixed(1) : 0;
  const fuelValueSaved = poolingData ? (fuelSaved * 92).toFixed(0) : 0;

  const tabs = [
    { id: 'routes', label: language === 'en' ? 'Available Routes' : 'उपलब्ध मार्ग' },
    { id: 'efficiency', label: t('routeEfficiency') },
    { id: 'backhaul', label: language === 'en' ? 'Backhaul Loads' : 'वापसी भार' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 border-2 border-invention-orange/30 border-t-invention-orange rounded-full animate-spin" />
        <p className="text-text-secondary text-sm font-medium animate-pulse">
          {language === 'en' ? 'Scanning routes...' : 'मार्ग खोज रहे हैं...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header Stats ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Fuel size={20} />} label={t('fuelSavings')} value={`${fuelSaved}L`}
          sub={`≈ ₹${Number(fuelValueSaved).toLocaleString()}`} color="orange" />
        <StatCard icon={<Route size={20} />} label={t('distanceSaved')}
          value={`${poolingData?.total_distance_saved_km?.toFixed(0) || 0} km`}
          sub={language === 'en' ? 'Less driving' : 'कम ड्राइविंग'} color="mint" />
        <StatCard icon={<IndianRupee size={20} />} label={t('profitIncrease')}
          value={`₹${poolingData?.total_profit_increase_inr?.toLocaleString() || 0}`}
          sub={language === 'en' ? 'Extra earnings' : 'अतिरिक्त कमाई'} color="orange" />
        <StatCard icon={<Zap size={20} />} label={language === 'en' ? 'Efficiency' : 'दक्षता'}
          value={`${poolingData?.efficiency_pct || 0}%`}
          sub={language === 'en' ? 'Route optimized' : 'मार्ग अनुकूलित'} color="mint" />
      </div>

      {/* ─── QR Check-in Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 flex items-center justify-between border-l-2 border-l-invention-orange"
      >
        <div className="flex items-center gap-3">
          <ScanLine size={20} className="text-invention-orange" />
          <div>
            <p className="text-sm font-bold text-text-primary">
              {language === 'en' ? 'QR Check-in at Setu Point' : 'सेतु पॉइंट पर QR चेक-इन'}
            </p>
            <p className="text-xs text-text-muted">
              {language === 'en' ? 'Scan to verify pickup and build trust score' : 'पिकअप सत्यापित करें और विश्वास स्कोर बनाएं'}
            </p>
          </div>
        </div>
        <button onClick={() => setShowScanner(!showScanner)}
          className="btn-cta py-2 px-4 text-sm flex items-center gap-1.5">
          <ScanLine size={14} /> {language === 'en' ? 'Scan QR' : 'QR स्कैन'}
        </button>
      </motion.div>

      {/* ─── Tabs ─── */}
      <div className="flex gap-1 bg-surface-card/50 p-1 rounded-none border border-border">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-4 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-invention-orange/10 text-invention-orange border-b-2 border-invention-orange'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/3'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Available Routes ─── */}
      {activeTab === 'routes' && poolingData && (
        <div className="space-y-6">
          <SetuPointMap groups={poolingData.groups} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {poolingData.groups.map((group, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 space-y-3 border-l-2 border-l-invention-orange">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-text-primary text-sm">{group.setu_point.name}</h4>
                    <p className="text-xs text-text-muted">{group.setu_point.village_cluster.join(' · ')}</p>
                  </div>
                  <span className="text-xs font-bold text-invention-orange bg-invention-orange/10 px-2 py-1">
                    {group.farmer_count} pickups
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white/3 p-2 border border-border">
                    <span className="text-text-muted block">Load</span>
                    <span className="text-text-primary font-bold">{group.total_weight_kg} kg</span>
                  </div>
                  <div className="bg-white/3 p-2 border border-border">
                    <span className="text-text-muted block">Distance</span>
                    <span className="text-mint-green font-bold">{group.optimized_distance_km} km</span>
                  </div>
                  <div className="bg-white/3 p-2 border border-border">
                    <span className="text-text-muted block">Earn</span>
                    <span className="text-invention-orange font-bold">₹{group.profit_increase_inr}</span>
                  </div>
                </div>

                <button className="btn-cta w-full py-2.5 text-sm flex items-center justify-center gap-2">
                  {language === 'en' ? 'Accept Route' : 'मार्ग स्वीकारें'} <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Route Efficiency ─── */}
      {activeTab === 'efficiency' && poolingData && (
        <div className="space-y-4">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-text-primary">{t('routeEfficiency')}</h3>
            {poolingData.groups.map((g, i) => {
              const saved = g.total_distance_km - g.optimized_distance_km;
              const pct = ((saved / g.total_distance_km) * 100).toFixed(0);
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{g.setu_point.name}</span>
                    <span className="text-mint-green font-bold">{pct}% saved</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full bg-gradient-to-r from-mint-green to-mint-soft"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Individual: {g.total_distance_km} km</span>
                    <span>Pooled: {g.optimized_distance_km} km</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Backhaul Loads ─── */}
      {activeTab === 'backhaul' && (
        <div className="space-y-4">
          <div className="glass-card p-5 border-l-2 border-l-mint-green">
            <h3 className="text-sm font-bold text-text-primary mb-1">
              {language === 'en' ? 'Fill Your Empty Truck' : 'अपना खाली ट्रक भरें'}
            </h3>
            <p className="text-xs text-text-secondary">
              {language === 'en'
                ? 'Returning empty? Pick up seeds & fertilizers for farmers and earn extra!'
                : 'खाली लौट रहे हैं? किसानों के लिए बीज और खाद ले जाएं, अतिरिक्त कमाएं!'}
            </p>
          </div>

          {backhaulData?.offers?.map((offer, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-text-primary">
                  {offer.items_matched.map(it => it.item_name).join(', ')}
                </span>
                <span className="text-xs font-bold text-mint-green bg-mint-green/10 px-2 py-1">
                  +₹{offer.discounted_price_inr} earn
                </span>
              </div>
              <div className="flex gap-3 text-xs text-text-muted">
                <span>⛽ {offer.fuel_saved_liters}L fuel used</span>
                <span>📦 {offer.items_matched.reduce((a, b) => a + b.weight_kg, 0)} kg</span>
              </div>
              <button className="btn-mint w-full py-2 text-sm font-bold">
                {language === 'en' ? 'Pick Up Load' : 'भार उठाएं'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className={`glass-card p-4 space-y-2 border-l-2 ${
        color === 'orange' ? 'border-l-invention-orange' : 'border-l-mint-green'
      }`}>
      <div className={`w-8 h-8 flex items-center justify-center ${
        color === 'orange' ? 'text-invention-orange' : 'text-mint-green'
      }`}>{icon}</div>
      <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-black ${color === 'orange' ? 'text-invention-orange' : 'text-mint-green'}`}>{value}</p>
      <p className="text-[10px] text-text-muted">{sub}</p>
    </motion.div>
  );
}
