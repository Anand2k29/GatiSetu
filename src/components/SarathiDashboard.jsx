import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDemoPooling, getDemoBackhaul } from '../services/api';
import SetuPointMap from './SetuPointMap';
import QRScanner from './QRScanner';
import {
  Fuel, TrendingUp, Truck, MapPin, Package, ScanLine,
  ArrowRight, Users, Route, IndianRupee, Zap, CheckCircle2, AlertTriangle
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
  const fuelTraditional = poolingData ? (poolingData.groups.reduce((a, g) => a + g.total_distance_km, 0) * 0.35).toFixed(1) : 0;
  const deadMilesEliminated = poolingData ? (poolingData.total_distance_saved_km * 0.8).toFixed(0) : 0;
  const deadMilesPct = poolingData ? ((poolingData.total_distance_saved_km / poolingData.groups.reduce((a, g) => a + g.total_distance_km, 0)) * 100 * 0.8).toFixed(0) : 0;

  const tabs = [
    { id: 'routes', label: language === 'en' ? 'Available Routes' : 'उपलब्ध मार्ग' },
    { id: 'efficiency', label: t('routeEfficiency') },
    { id: 'backhaul', label: language === 'en' ? 'Backhaul Loads' : 'वापसी भार' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-2 border-invention-orange/30 border-t-invention-orange animate-spin" style={{ borderRadius: '2px' }} />
        <p className="text-text-muted text-xs font-bold tracking-wider uppercase" style={{ fontFamily: 'Outfit' }}>
          {language === 'en' ? 'Scanning routes...' : 'मार्ग खोज रहे हैं...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ─── Comparative KPI Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Fuel Saved vs Traditional */}
        <div className="kpi-card kpi-card-orange space-y-2">
          <div className="flex items-center gap-2 text-invention-orange"><Fuel size={16} /></div>
          <p className="header-label">{t('fuelSavedVsTraditional')}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-mint-green">{fuelSaved}L</span>
            <span className="text-[10px] text-text-muted">saved</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-danger line-through">{fuelTraditional}L</span>
            <ArrowRight size={10} className="text-text-muted" />
            <span className="text-mint-green font-bold">{(fuelTraditional - fuelSaved).toFixed(1)}L</span>
          </div>
        </div>

        {/* Dead Miles Eliminated */}
        <div className="kpi-card kpi-card-mint space-y-2">
          <div className="flex items-center gap-2 text-mint-green"><Route size={16} /></div>
          <p className="header-label">{t('deadMilesEliminated')}</p>
          <span className="text-xl font-black text-mint-green">{deadMilesEliminated} km</span>
          <div className="w-full h-1.5 bg-surface" style={{ borderRadius: '1px' }}>
            <div className="h-full bg-mint-green" style={{ width: `${Math.min(Number(deadMilesPct), 100)}%`, borderRadius: '1px' }} />
          </div>
          <p className="text-[10px] text-text-muted">{deadMilesPct}% reduction</p>
        </div>

        {/* Profit */}
        <div className="kpi-card kpi-card-orange space-y-2">
          <div className="flex items-center gap-2 text-invention-orange"><IndianRupee size={16} /></div>
          <p className="header-label">{t('profitIncrease')}</p>
          <span className="text-xl font-black text-invention-orange">₹{poolingData?.total_profit_increase_inr?.toLocaleString() || 0}</span>
          <p className="text-[10px] text-text-muted">{language === 'en' ? 'Extra earnings' : 'अतिरिक्त कमाई'}</p>
        </div>

        {/* Efficiency */}
        <div className="kpi-card kpi-card-mint space-y-2">
          <div className="flex items-center gap-2 text-mint-green"><Zap size={16} /></div>
          <p className="header-label">{language === 'en' ? 'Efficiency' : 'दक्षता'}</p>
          <span className="text-xl font-black text-mint-green">{poolingData?.efficiency_pct || 0}%</span>
          <p className="text-[10px] text-text-muted">{language === 'en' ? 'Route optimized' : 'मार्ग अनुकूलित'}</p>
        </div>
      </div>

      {/* ─── QR Scanner Banner ─── */}
      <div className="card-industrial card-industrial-orange p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ScanLine size={18} className="text-invention-orange" />
          <div>
            <p className="text-xs font-bold text-text-primary uppercase tracking-wider" style={{ fontFamily: 'Outfit' }}>
              {t('scanGatiPass')}
            </p>
            <p className="text-[10px] text-text-muted">{language === 'en' ? 'Scan to verify pickup and build trust score' : 'पिकअप सत्यापित करें'}</p>
          </div>
        </div>
        <button onClick={() => setShowScanner(!showScanner)} className="btn-cta py-2 px-4 text-xs flex items-center gap-1.5">
          <ScanLine size={13} /> {language === 'en' ? 'Scan QR' : 'QR स्कैन'}
        </button>
      </div>

      {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}

      {/* ─── Tab Bar ─── */}
      <div className="tab-bar">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-item ${activeTab === tab.id ? 'active-orange' : ''}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Available Routes with Demand Heatmap ─── */}
      {activeTab === 'routes' && poolingData && (
        <div className="space-y-5">
          {/* Demand Heatmap Legend */}
          <div className="card-industrial p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="header-label text-invention-orange flex items-center gap-2"><MapPin size={13} /> {language === 'en' ? 'Demand Heatmap' : 'मांग हीटमैप'}</h3>
              <div className="flex items-center gap-2 text-[9px] text-text-muted uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="w-3 h-3 density-low inline-block" style={{ borderRadius: '1px' }} /> Low</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 density-medium inline-block" style={{ borderRadius: '1px' }} /> Mid</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 density-high inline-block" style={{ borderRadius: '1px' }} /> High</span>
              </div>
            </div>
            <SetuPointMap groups={poolingData.groups} heatmapMode />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {poolingData.groups.map((group, i) => (
              <div key={i} className="card-industrial card-industrial-orange p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">{group.setu_point.name}</h4>
                    <p className="text-[10px] text-text-muted">{group.setu_point.village_cluster.join(' · ')}</p>
                  </div>
                  <span className="text-[10px] font-bold text-invention-orange bg-invention-orange/10 px-2 py-1 border border-invention-orange/20" style={{ borderRadius: '2px' }}>
                    {group.farmer_count} pickups
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="border border-border p-2" style={{ borderRadius: '2px' }}>
                    <span className="text-text-muted block header-label">Load</span>
                    <span className="text-text-primary font-bold">{group.total_weight_kg} kg</span>
                  </div>
                  <div className="border border-border p-2" style={{ borderRadius: '2px' }}>
                    <span className="text-text-muted block header-label">Distance</span>
                    <span className="text-mint-green font-bold">{group.optimized_distance_km} km</span>
                  </div>
                  <div className="border border-border p-2" style={{ borderRadius: '2px' }}>
                    <span className="text-text-muted block header-label">Earn</span>
                    <span className="text-invention-orange font-bold">₹{group.profit_increase_inr}</span>
                  </div>
                </div>
                <button className="btn-cta w-full py-2.5 text-xs flex items-center justify-center gap-2">
                  {language === 'en' ? 'Accept Route' : 'मार्ग स्वीकारें'} <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Route Efficiency ─── */}
      {activeTab === 'efficiency' && poolingData && (
        <div className="card-industrial p-5 space-y-4">
          <h3 className="header-label text-invention-orange">{t('routeEfficiency')}</h3>
          {poolingData.groups.map((g, i) => {
            const saved = g.total_distance_km - g.optimized_distance_km;
            const pct = ((saved / g.total_distance_km) * 100).toFixed(0);
            return (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary font-medium">{g.setu_point.name}</span>
                  <span className="text-mint-green font-bold">{pct}% saved</span>
                </div>
                <div className="w-full h-2 bg-surface" style={{ borderRadius: '1px' }}>
                  <div className="h-full bg-mint-green transition-all" style={{ width: `${pct}%`, borderRadius: '1px' }} />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted">
                  <span>Individual: {g.total_distance_km} km</span>
                  <span>Pooled: {g.optimized_distance_km} km</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Backhaul Loads ─── */}
      {activeTab === 'backhaul' && (
        <div className="space-y-4">
          <div className="card-industrial card-industrial-mint p-4">
            <h3 className="header-label text-mint-green mb-1">{language === 'en' ? 'Fill Your Empty Truck' : 'अपना खाली ट्रक भरें'}</h3>
            <p className="text-[10px] text-text-secondary">{language === 'en' ? 'Returning empty? Pick up seeds & fertilizers for farmers and earn extra!' : 'खाली लौट रहे हैं? किसानों के लिए बीज और खाद ले जाएं!'}</p>
          </div>
          {backhaulData?.offers?.map((offer, i) => (
            <div key={i} className="card-industrial p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-text-primary">{offer.items_matched.map(it => it.item_name).join(', ')}</span>
                <span className="text-[10px] font-bold text-mint-green bg-mint-green/10 px-2 py-1 border border-mint-green/20" style={{ borderRadius: '2px' }}>+₹{offer.discounted_price_inr}</span>
              </div>
              <div className="flex gap-3 text-[10px] text-text-muted">
                <span>⛽ {offer.fuel_saved_liters}L fuel</span>
                <span>📦 {offer.items_matched.reduce((a, b) => a + b.weight_kg, 0)} kg</span>
              </div>
              <button className="btn-kisan w-full py-2 text-xs">{language === 'en' ? 'Pick Up Load' : 'भार उठाएं'}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
