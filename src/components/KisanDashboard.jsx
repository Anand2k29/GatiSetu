import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { getDemoPooling, getDemoBackhaul, getExplanation } from '../services/api';
import { speakText, stopSpeaking } from '../services/ttsEngine';
import VoiceToRoute from './VoiceToRoute';
import AIExplainer from './AIExplainer';
import SetuPointMap from './SetuPointMap';
import QRCode from 'react-qr-code';
import CountUp from 'react-countup';
import {
  IndianRupee, Leaf, TrendingUp, Package, MapPin, Mic,
  ArrowRight, Volume2, ShoppingBag, Truck, Users, Zap
} from 'lucide-react';

export default function KisanDashboard() {
  const { t, language, poolingData, setPoolingData, backhaulData, setBackhaulData, userName } = useApp();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showVoice, setShowVoice] = useState(false);

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

  // Find user's group in pooling data
  const myGroup = poolingData?.groups?.[0];
  const totalEarnings = poolingData?.total_profit_increase_inr || 0;

  const tabs = [
    { id: 'overview', label: language === 'en' ? 'Overview' : 'अवलोकन' },
    { id: 'pooling', label: t('poolingStatus') },
    { id: 'backhaul', label: t('backhaul') },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 border-2 border-mint-green/30 border-t-mint-green rounded-full animate-spin" />
        <p className="text-text-secondary text-sm font-medium animate-pulse">
          {language === 'en' ? 'Loading your dashboard...' : 'डैशबोर्ड लोड हो रहा है...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header Stats Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<IndianRupee size={20} />}
          label={t('earnings')}
          value={`₹${totalEarnings.toLocaleString()}`}
          sub={language === 'en' ? 'This session' : 'इस सत्र'}
          color="mint"
        />
        <StatCard
          icon={<Users size={20} />}
          label={t('pooled')}
          value={poolingData?.total_farmers_pooled || 0}
          sub={language === 'en' ? 'Farmers pooled' : 'किसान जुड़े'}
          color="orange"
        />
        <StatCard
          icon={<Leaf size={20} />}
          label={t('carbonSaved')}
          value={`${poolingData?.total_carbon_saved_kg?.toFixed(1) || 0} kg`}
          sub="CO₂"
          color="mint"
        />
        <StatCard
          icon={<Zap size={20} />}
          label={language === 'en' ? 'Efficiency' : 'दक्षता'}
          value={`${poolingData?.efficiency_pct || 0}%`}
          sub={language === 'en' ? 'Route optimized' : 'मार्ग अनुकूलित'}
          color="orange"
        />
      </div>

      {/* ─── Tab Bar ─── */}
      <div className="flex gap-1 bg-surface-card/50 p-1 rounded-xl border border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-mint-green/10 text-mint-green'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/3'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pooling Status Card */}
          {myGroup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card glass-card-mint p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <MapPin size={18} className="text-mint-green" />
                  {t('poolingStatus')}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="status-dot" />
                  <span className="text-xs font-bold text-mint-green uppercase">{language === 'en' ? 'Active' : 'सक्रिय'}</span>
                </div>
              </div>

              <div className="bg-white/3 rounded-xl p-4 border border-mint-green/10">
                <p className="text-sm text-text-secondary mb-2">
                  {language === 'en'
                    ? `Your load is pooled with ${myGroup.farmer_count - 1} other Kisans at:`
                    : `आपका भार ${myGroup.farmer_count - 1} अन्य किसानों के साथ जुड़ा है:`}
                </p>
                <p className="text-lg font-bold text-mint-green">{myGroup.setu_point.name}</p>
                <p className="text-xs text-text-muted mt-1">
                  {myGroup.setu_point.landmark_type} · {myGroup.setu_point.village_cluster.join(', ')}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <MiniMetric label={t('totalWeight')} value={`${myGroup.total_weight_kg} kg`} />
                <MiniMetric label={t('carbonSaved')} value={`${myGroup.carbon_saved_kg} kg`} />
                <MiniMetric label={t('profitIncrease')} value={`₹${myGroup.profit_increase_inr}`} />
              </div>

              {/* QR Code */}
              <div className="flex items-center justify-center p-4 bg-white rounded-xl">
                <QRCode
                  value={JSON.stringify({
                    setu_point: myGroup.setu_point.id,
                    farmers: myGroup.farmer_count,
                    weight: myGroup.total_weight_kg,
                  })}
                  size={100}
                />
              </div>
              <p className="text-center text-xs text-text-muted">
                {language === 'en' ? 'Show QR at Setu Point for verification' : 'सेतु पॉइंट पर सत्यापन के लिए QR दिखाएं'}
              </p>
            </motion.div>
          )}

          {/* Voice Order + AI Explainer */}
          <div className="space-y-6">
            {/* Voice Order Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card glass-card-orange p-6"
            >
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-3">
                <Mic size={18} className="text-invention-orange" />
                {t('voiceOrder')}
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                {language === 'en'
                  ? 'Speak in Hindi or English to create a shipping order instantly.'
                  : 'हिंदी या अंग्रेज़ी में बोलकर तुरंत शिपिंग ऑर्डर बनाएं।'}
              </p>
              <button
                onClick={() => setShowVoice(true)}
                className="btn-cta w-full flex items-center justify-center gap-2"
              >
                <Mic size={18} />
                {language === 'en' ? 'Start Voice Order' : 'आवाज़ ऑर्डर शुरू करें'}
              </button>
            </motion.div>

            {/* AI Explainer */}
            {poolingData && <AIExplainer poolingData={poolingData} />}
          </div>
        </div>
      )}

      {activeTab === 'pooling' && poolingData && (
        <div className="space-y-6">
          <SetuPointMap groups={poolingData.groups} />

          {/* All Pooling Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {poolingData.groups.map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-primary text-sm">{group.setu_point.name}</h4>
                  <span className="text-xs font-bold text-mint-green bg-mint-green/10 px-2 py-1 rounded-full">
                    {group.farmer_count} {language === 'en' ? 'farmers' : 'किसान'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/3 rounded-lg p-2">
                    <span className="text-text-muted block">{t('totalWeight')}</span>
                    <span className="text-text-primary font-bold">{group.total_weight_kg} kg</span>
                  </div>
                  <div className="bg-white/3 rounded-lg p-2">
                    <span className="text-text-muted block">{t('carbonSaved')}</span>
                    <span className="text-mint-green font-bold">{group.carbon_saved_kg} kg</span>
                  </div>
                  <div className="bg-white/3 rounded-lg p-2">
                    <span className="text-text-muted block">{t('distanceSaved')}</span>
                    <span className="text-text-primary font-bold">{(group.total_distance_km - group.optimized_distance_km).toFixed(0)} km</span>
                  </div>
                  <div className="bg-white/3 rounded-lg p-2">
                    <span className="text-text-muted block">{t('profitIncrease')}</span>
                    <span className="text-invention-orange font-bold">₹{group.profit_increase_inr}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.farmers.map((f, j) => (
                    <span key={j} className="text-[10px] bg-white/5 text-text-secondary px-2 py-0.5 rounded-full border border-border">
                      {f.name} · {f.weight_kg}kg {f.crop}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'backhaul' && (
        <div className="space-y-4">
          <div className="glass-card p-6 mb-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-2">
              <ShoppingBag size={18} className="text-invention-orange" />
              {t('backhaul')}
            </h3>
            <p className="text-sm text-text-secondary">
              {language === 'en'
                ? 'Get seeds, fertilizers, and equipment delivered at 60% discount via returning trucks!'
                : 'खाली लौट रहे ट्रकों से 60% छूट पर बीज, खाद और उपकरण मंगवाएं!'}
            </p>
          </div>

          {backhaulData?.offers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {backhaulData.offers.map((offer, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card glass-card-orange p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-invention-orange" />
                      <span className="font-bold text-text-primary text-sm">{offer.truck.driver_name}</span>
                    </div>
                    <span className="text-xs text-text-muted">{offer.truck.vehicle_number}</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {offer.truck.return_route_from} → {offer.truck.return_route_to} · ETA {offer.truck.eta_hours}h
                  </p>
                  <div className="flex items-center justify-between bg-white/3 rounded-xl p-3">
                    <div>
                      <p className="text-xs text-text-muted line-through">₹{offer.standard_price_inr}</p>
                      <p className="text-xl font-black text-mint-green">₹{offer.discounted_price_inr}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-invention-orange bg-invention-orange/10 px-2 py-1 rounded-full">
                        {offer.discount_pct}% OFF
                      </span>
                      <p className="text-xs text-mint-green mt-1">{t('savings')}: ₹{offer.savings_inr}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-white/5 px-2 py-1 rounded-lg text-text-secondary">
                      ⛽ {offer.fuel_saved_liters}L saved
                    </span>
                    <span className="bg-white/5 px-2 py-1 rounded-lg text-text-secondary">
                      🛤️ {offer.dead_miles_reduced_km}km reduced
                    </span>
                  </div>
                  <button className="btn-cta w-full py-2.5 text-sm">
                    {language === 'en' ? 'Book Return Load' : 'वापसी भार बुक करें'}
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <Package size={48} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-secondary font-medium">
                {language === 'en' ? 'No backhaul offers available right now' : 'अभी कोई वापसी भार उपलब्ध नहीं'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Voice Order Modal */}
      {showVoice && <VoiceToRoute onClose={() => setShowVoice(false)} />}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  const isNumber = typeof value === 'number';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card ${color === 'mint' ? 'glass-card-mint' : 'glass-card-orange'} p-4 space-y-2`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        color === 'mint' ? 'bg-mint-green/15 text-mint-green' : 'bg-invention-orange/15 text-invention-orange'
      }`}>
        {icon}
      </div>
      <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-black ${color === 'mint' ? 'text-mint-green' : 'text-invention-orange'}`}>
        {isNumber ? <CountUp end={value} duration={1.5} /> : value}
      </p>
      <p className="text-[10px] text-text-muted">{sub}</p>
    </motion.div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-text-muted font-semibold uppercase">{label}</p>
      <p className="text-sm font-bold text-text-primary">{value}</p>
    </div>
  );
}
