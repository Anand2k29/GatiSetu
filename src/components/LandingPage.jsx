import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Truck, Sprout, ArrowRight, TrendingDown, TrendingUp, AlertTriangle,
  Route, Users, Zap, IndianRupee, Leaf, MapPin, Package, ChevronRight, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Login from './Login';
import UserGuide from './UserGuide';
import { useApp } from '../context/AppContext';


const CHART_DATA = [
  { name: 'Cost/km', Traditional: 100, GatiSetu: 42 },
  { name: 'Income/mo', Traditional: 15000, GatiSetu: 23800 },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const { language, setLanguage } = useApp();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToLogin = () => {
    document.getElementById('login-portal').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* ─── Floating Nav ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'bg-surface border-border py-4 shadow-lg' : 'bg-transparent border-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-invention-orange flex items-center justify-center" style={{ borderRadius: '2px' }}>
              <span className="text-xs font-black text-surface font-[Outfit]">GS</span>
            </div>
            <span className="text-sm font-black text-white font-[Outfit] tracking-[-0.02em] uppercase">
              Gati<span className="text-invention-orange">Setu</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-text-primary font-[Outfit] uppercase tracking-wider">
            <a href="#problem" className="hover:text-invention-orange transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-mint-green transition-colors">How it Works</a>
            <a href="#audit" className="hover:text-invention-orange transition-colors">Performance Audit</a>
            <button
              onClick={() => setShowGuideModal(true)}
              className="text-mint-green hover:text-white transition-colors flex items-center gap-1.5 font-black uppercase"
            >
              📖 User Guide
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="text-xs font-bold text-text-primary uppercase border border-border px-3 py-1.5 hover:bg-surface-elevated transition-colors" style={{ borderRadius: '2px' }}>
              {language === 'en' ? 'HI' : 'EN'}
            </button>
            <button onClick={scrollToLogin} className="btn-cta py-3 px-8 text-xs flex items-center gap-2">
              Login Portal <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* User Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xs shadow-2xl">
            <UserGuide onClose={() => setShowGuideModal(false)} />
          </div>
        </div>
      )}

      {/* ─── Hero Section (Full-Width Immersive) ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_banner.png"
            alt="Indian Farmer and Sarathi Driver"
            className="w-full h-full object-cover"
            style={{ objectPosition: '40% 15%' }}
          />
        </div>

        {/* Left-to-right gradient: text-safe on left, transparent on right */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(to right, rgba(10,15,30,0.88) 0%, rgba(10,15,30,0.65) 35%, rgba(10,15,30,0.20) 55%, rgba(10,15,30,0.0) 75%)',
          }}
        />

        {/* Bottom dissolve into next section */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 80%, #0A0F1E 100%)',
          }}
        />

        {/* Text content — pinned left */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 border border-mint-green/30 px-3 py-1.5 text-[10px] font-bold text-mint-green tracking-wider uppercase bg-mint-green/10" style={{ fontFamily: 'Outfit' }}>
              <Zap size={12} /> Predictive Resource Pooling
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white font-[Outfit] tracking-[-0.02em] uppercase leading-[1.1]">
              {language === 'en' ? (
                <>Empowering <span className="text-invention-orange">Bharat's</span> Agri-Supply Chain</>
              ) : (
                <><span className="text-invention-orange">भारत की</span> कृषि-आपूर्ति श्रृंखला को सशक्त बनाना</>
              )}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
              {language === 'en'
                ? "We connect farmers to mandis through AI-optimized truck routes. Eliminating middlemen, erasing dead-miles, and boosting incomes for everyone."
                : "हम किसानों को AI-अनुकूलित ट्रकों के माध्यम से मंडियों से जोड़ते हैं। बिचौलियों और खाली वापसी को समाप्त कर सभी की आय बढ़ाते हैं।"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={scrollToLogin} className="btn-kisan py-4 px-10 text-sm flex items-center justify-center gap-2">
                <Sprout size={16} /> {language === 'en' ? 'I am a Kisan' : 'मैं किसान हूँ'}
              </button>
              <button onClick={scrollToLogin} className="btn-sarathi py-4 px-10 text-sm flex items-center justify-center gap-2">
                <Truck size={16} /> {language === 'en' ? 'I am a Sarathi' : 'मैं सारथी हूँ'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Problem Section ─── */}
      <section id="problem" className="py-24 border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-black text-danger font-[Outfit] tracking-[-0.02em] uppercase mb-12 flex items-center gap-2">
            <AlertTriangle size={16} className="text-danger" /> {language === 'en' ? 'The Problem' : 'समस्या'}
          </h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <ProblemCard color="orange" icon={<IndianRupee size={28} strokeWidth={2.5} />} title={language === 'en' ? "High Middleman Commissions" : "बिचौलियों का उच्च कमीशन"} desc="Farmers lose 40-60% of their earnings to intermediaries due to fragmented access to logistics." />
            </div>
            <div className="col-span-12 md:col-span-4">
              <ProblemCard color="mint" icon={<Truck size={28} strokeWidth={2.5} />} title={language === 'en' ? "Empty Return Trips" : "खाली वापसी यात्राएं"} desc="Over 60% of trucks return empty from mandis resulting in dead-miles, wasted fuel, and lost income." />
            </div>
            <div className="col-span-12 md:col-span-4">
              <ProblemCard color="orange" icon={<AlertTriangle size={28} strokeWidth={2.5} />} title={language === 'en' ? "Fragmented Supply Chains" : "खंडित आपूर्ति श्रृंखलाएं"} desc="Individual farmers shipping small loads individually face maximum costs and minimum efficiency." />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Solution Section ─── */}
      <section id="solution" className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-12 items-center">
            <div className="col-span-12 lg:col-span-5 space-y-8">
              <h2 className="text-xs font-black text-mint-green font-[Outfit] tracking-[-0.02em] uppercase flex items-center gap-2">
                <Zap size={14} /> The GatiSetu Solution
              </h2>
              <h3 className="text-3xl font-black text-text-primary font-[Outfit] tracking-[-0.02em] uppercase leading-tight">
                Predictive Resource Pooling at Scale
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Our AI engine dynamically clusters nearby farmer loads at virtual Setu Points. Instead of 5 farmers hiring 5 half-empty trucks, GatiSetu routes a single optimized truck to pick up all loads. Returning trucks bring back subsidized seeds and fertilizers, eliminating dead-miles entirely.
              </p>
              <div className="space-y-4">
                <SolutionStep step="01" title="Cluster" desc="Farmers log loads via voice/scan. AI clusters them to a Setu Point." color="mint" />
                <SolutionStep step="02" title="Route" desc="Sarathis receive pre-optimized routes with guaranteed full capacity." color="orange" />
                <SolutionStep step="03" title="Backhaul" desc="Empty return trucks carry subsidized farming inputs back to the village." color="mint" />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-7 card-industrial overflow-hidden h-full min-h-[400px]">
              <LogisticsGrid />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Impact Metrics (Audit) ─── */}
      <section id="audit" className="py-24 bg-surface-elevated border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 lg:col-span-5 space-y-6">
              <h2 className="text-xs font-black text-invention-orange font-[Outfit] tracking-[-0.02em] uppercase flex items-center gap-2">
                <BarChart3 size={14} /> Performance Audit
              </h2>
              <h3 className="text-3xl font-black text-text-primary font-[Outfit] tracking-[-0.02em] uppercase leading-tight">
                Proven Economic Viability
              </h3>
              <p className="text-text-secondary leading-relaxed">
                GatiSetu isn't just an idea. Our predictive AI models demonstrate massive cost reductions for farmers and significant profit increases for drivers when compared to traditional middlemen networks.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Farmer Savings */}
                <div className="border border-border border-t-4 border-t-mint-green p-5 bg-surface space-y-3 shadow-lg">
                  <p className="text-4xl font-black text-mint-green font-[Outfit]">-58%</p>
                  <div>
                    <p className="text-xs font-black text-text-primary uppercase tracking-wider font-[Outfit]">Transport Cost</p>
                    <p className="text-[10px] text-text-muted mt-1 font-[Plus_Jakarta_Sans]">Pooled loads vs. individual middlemen trucks</p>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-sm overflow-hidden">
                    <div className="h-full bg-mint-green" style={{ width: '42%' }}></div>
                  </div>
                  <p className="text-[10px] text-mint-green font-bold uppercase tracking-wider font-[Outfit]">₹42/km vs ₹100/km</p>
                </div>

                {/* Driver Income */}
                <div className="border border-border border-t-4 border-t-invention-orange p-5 bg-surface space-y-3 shadow-lg">
                  <p className="text-4xl font-black text-invention-orange font-[Outfit]">+59%</p>
                  <div>
                    <p className="text-xs font-black text-text-primary uppercase tracking-wider font-[Outfit]">Driver Income</p>
                    <p className="text-[10px] text-text-muted mt-1 font-[Plus_Jakarta_Sans]">Backhaul loads eliminate empty return trips</p>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-sm overflow-hidden">
                    <div className="h-full bg-invention-orange" style={{ width: '59%' }}></div>
                  </div>
                  <p className="text-[10px] text-invention-orange font-bold uppercase tracking-wider font-[Outfit]">₹23.8K vs ₹15K / month</p>
                </div>

                {/* Dead Miles */}
                <div className="border border-border border-t-4 border-t-danger p-5 bg-surface space-y-3 shadow-lg">
                  <p className="text-4xl font-black text-danger font-[Outfit]">-62%</p>
                  <div>
                    <p className="text-xs font-black text-text-primary uppercase tracking-wider font-[Outfit]">CO₂ Emissions</p>
                    <p className="text-[10px] text-text-muted mt-1 font-[Plus_Jakarta_Sans]">38kg vs 100kg CO₂ per trip</p>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-sm overflow-hidden">
                    <div className="h-full bg-danger" style={{ width: '38%' }}></div>
                  </div>
                  <p className="text-[10px] text-danger font-bold uppercase tracking-wider font-[Outfit]">38kg vs 100kg CO₂</p>
                </div>

                {/* Return Goods Discount */}
                <div className="border border-border border-t-4 border-t-mint-green p-5 bg-surface space-y-3 shadow-lg">
                  <p className="text-4xl font-black text-mint-green font-[Outfit]">-60%</p>
                  <div>
                    <p className="text-xs font-black text-text-primary uppercase tracking-wider font-[Outfit]">Input Costs</p>
                    <p className="text-[10px] text-text-muted mt-1 font-[Plus_Jakarta_Sans]">Seeds & fertilizer via return truck subsidy</p>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-sm overflow-hidden">
                    <div className="h-full bg-mint-green" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-[10px] text-mint-green font-bold uppercase tracking-wider font-[Outfit]">₹400 vs ₹1000 / bag</p>
                </div>
              </div>
            </div>

            {/* Right Column: Properly Scaled Dual Comparative Metric Charts */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
              {/* Chart 1: Freight Transport Cost (₹/km) */}
              <div className="card-industrial p-6 space-y-3 bg-surface border border-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-white font-[Outfit] uppercase tracking-wider">
                    Farmer Freight Transport Cost (₹ per km)
                  </h4>
                  <span className="text-[10px] font-bold text-mint-green bg-mint-green/10 border border-mint-green/30 px-2 py-0.5 rounded-xs font-[Outfit]">
                    58% Lower Fare
                  </span>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Traditional', value: 100, fill: '#EF4444' },
                        { name: 'GatiSetu', value: 42, fill: '#10B981' }
                      ]}
                      margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" domain={[0, 120]} tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Outfit' }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#F8FAFC', fontSize: 11, fontFamily: 'Outfit', fontWeight: 'bold' }} />
                      <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFF' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Sarathi Monthly Earnings (₹/mo) */}
              <div className="card-industrial p-6 space-y-3 bg-surface border border-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-white font-[Outfit] uppercase tracking-wider">
                    Sarathi Driver Monthly Income (₹ per month)
                  </h4>
                  <span className="text-[10px] font-bold text-invention-orange bg-invention-orange/10 border border-invention-orange/30 px-2 py-0.5 rounded-xs font-[Outfit]">
                    59% Income Growth
                  </span>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Traditional', value: 15000, fill: '#EF4444' },
                        { name: 'GatiSetu', value: 23800, fill: '#F59E0B' }
                      ]}
                      margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" domain={[0, 28000]} tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Outfit' }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#F8FAFC', fontSize: 11, fontFamily: 'Outfit', fontWeight: 'bold' }} />
                      <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFF' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─── Integrated Login Portal ─── */}
      <Login />

      {/* Footer */}
      <footer className="px-6 py-6 text-center border-t border-border bg-surface-elevated">
        <p className="text-text-muted text-[11px] tracking-wider uppercase font-bold" style={{ fontFamily: 'Outfit' }}>
          © 2026 GatiSetu · Agentic Logistics Ecosystem · Google Solution Challenge
        </p>
      </footer>
    </div>
  );
}

/* ─── Sub-Components ─── */

function ProblemCard({ icon, title, desc, color }) {
  const accent = color === 'mint' ? 'mint-green' : 'invention-orange';
  return (
    <div className={`card-industrial hover-lift p-8 space-y-4 border border-[#334155] border-t-4 border-t-${accent} h-full flex flex-col items-center text-center rounded-none`}>
      <div className={`w-14 h-14 border border-${accent}/30 flex items-center justify-center text-${accent} bg-${accent}/10 rounded-none`}>{icon}</div>
      <h3 className="text-base font-black text-text-primary font-[Outfit] tracking-[-0.02em] uppercase leading-snug">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}

function SolutionStep({ step, title, desc, color }) {
  const accent = color === 'mint' ? 'mint-green' : 'invention-orange';
  return (
    <div className={`flex gap-4 p-4 border border-border bg-surface hover:border-${accent} transition-colors`} style={{ borderRadius: '2px' }}>
      <span className={`text-2xl font-black text-${accent}/40 font-[Outfit]`}>{step}</span>
      <div>
        <h4 className="text-sm font-black text-text-primary font-[Outfit] tracking-[-0.02em] uppercase">{title}</h4>
        <p className="text-xs text-text-secondary mt-1">{desc}</p>
      </div>
    </div>
  );
}

function LogisticsGrid() {
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'

  const farmers = [
    { name: 'Rampur', lat: 28.8120, lng: 79.0230, crop: 'Wheat 350kg', hub: 'A' },
    { name: 'Bhojpur', lat: 28.8080, lng: 79.0270, crop: 'Rice 200kg', hub: 'A' },
    { name: 'Khanpur', lat: 28.8150, lng: 79.0210, crop: 'Mustard 150kg', hub: 'A' },
    { name: 'Sherpur', lat: 28.7830, lng: 79.0550, crop: 'Potato 400kg', hub: 'A' },
    { name: 'Noorpur', lat: 28.8420, lng: 79.0980, crop: 'Wheat 300kg', hub: 'B' },
    { name: 'Badlapur', lat: 28.8380, lng: 79.1020, crop: 'Onion 250kg', hub: 'B' },
    { name: 'Sonarpur', lat: 28.7520, lng: 78.9820, crop: 'Rice 220kg', hub: 'B' },
    { name: 'Fatehpur', lat: 28.7480, lng: 78.9840, crop: 'Mustard 280kg', hub: 'B' }
  ];

  const setuPoints = [
    { name: 'Setu Hub A (Rampur)', lat: 28.8100, lng: 79.0250, weight: '1,100 kg' },
    { name: 'Setu Hub B (Badlapur)', lat: 28.8400, lng: 79.1000, weight: '1,050 kg' }
  ];

  const mandi = { name: 'Azadpur Mandi (Delhi)', lat: 28.7168, lng: 77.1528 };

  const tileUrls = {
    roadmap: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    satellite: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
  };

  const createHubIcon = (name, weight) => {
    return L.divIcon({
      className: 'landing-hub-marker',
      html: `
        <div style="
          background-color: #0F172A;
          border: 2px solid #F59E0B;
          border-radius: 4px;
          padding: 4px 8px;
          color: white;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
          transform: translate(-50%, -100%);
        ">
          <div style="font-size: 11px; font-weight: 800; color: #F59E0B; text-transform: uppercase;">${name}</div>
          <div style="font-size: 9px; color: #CBD5E1; font-weight: 600;">Pooled Load: ${weight}</div>
        </div>
      `,
      iconSize: [0, 0]
    });
  };

  const createFarmerIcon = (name, crop) => {
    return L.divIcon({
      className: 'landing-farmer-marker',
      html: `
        <div style="
          background-color: #0F172A;
          border: 1.5px solid #10B981;
          border-radius: 3px;
          padding: 2px 6px;
          color: white;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
          transform: translate(-50%, -50%);
        ">
          <div style="font-size: 9.5px; font-weight: 700; color: #10B981;">${name}</div>
          <div style="font-size: 8px; color: #94A3B8;">${crop}</div>
        </div>
      `,
      iconSize: [0, 0]
    });
  };

  const createMandiIcon = (name) => {
    return L.divIcon({
      className: 'landing-mandi-marker',
      html: `
        <div style="
          background-color: #1E293B;
          border: 2px solid #3B82F6;
          border-radius: 4px;
          padding: 4px 8px;
          color: white;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.5);
          transform: translate(-50%, -100%);
        ">
          <div style="font-size: 11px; font-weight: 800; color: #60A5FA; text-transform: uppercase;">${name}</div>
          <div style="font-size: 9px; color: #94A3B8;">Central Terminal Mandi</div>
        </div>
      `,
      iconSize: [0, 0]
    });
  };

  return (
    <div className="relative w-full h-full min-h-[420px] flex flex-col bg-surface border border-border">
      {/* Map Control Bar */}
      <div className="flex items-center justify-between p-3 bg-surface-elevated border-b border-border z-20">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-invention-orange" />
          <span className="text-xs font-black text-white font-[Outfit] uppercase tracking-wider">
            Google Maps AI Pooling Topology
          </span>
        </div>
        <div className="flex bg-surface p-1 border border-border/80 rounded-xs">
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs font-[Outfit] transition-all ${
              mapType === 'roadmap' ? 'bg-invention-orange text-surface' : 'text-text-muted hover:text-white'
            }`}
          >
            Google Map
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs font-[Outfit] transition-all ${
              mapType === 'satellite' ? 'bg-invention-orange text-surface' : 'text-text-muted hover:text-white'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Leaflet Google Maps View */}
      <div className="relative flex-1 w-full h-full z-10 min-h-[360px]">
        <MapContainer
          center={[28.7800, 78.5000]}
          zoom={9}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', minHeight: '360px', backgroundColor: '#0F172A' }}
        >
          <TileLayer
            url={tileUrls[mapType]}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            attribution="&copy; Google Maps"
          />

          {/* Farmer to Setu Hub Polylines */}
          {farmers.map((f, i) => {
            const hub = f.hub === 'A' ? setuPoints[0] : setuPoints[1];
            return (
              <React.Fragment key={`f-polyline-${i}`}>
                <Polyline
                  positions={[
                    [f.lat, f.lng],
                    [hub.lat, hub.lng]
                  ]}
                  pathOptions={{
                    color: '#10B981',
                    weight: 2,
                    dashArray: '4 4',
                    opacity: 0.7
                  }}
                />
                <Marker position={[f.lat, f.lng]} icon={createFarmerIcon(f.name, f.crop)} />
              </React.Fragment>
            );
          })}

          {/* Setu Hub to Mandi Highway Lines */}
          {setuPoints.map((sp, i) => (
            <React.Fragment key={`sp-polyline-${i}`}>
              <Polyline
                positions={[
                  [sp.lat, sp.lng],
                  [mandi.lat, mandi.lng]
                ]}
                pathOptions={{
                  color: '#F59E0B',
                  weight: 3.5,
                  opacity: 0.9
                }}
              />
              <Circle
                center={[sp.lat, sp.lng]}
                radius={2500}
                pathOptions={{
                  color: '#F59E0B',
                  fillColor: '#F59E0B',
                  fillOpacity: 0.15,
                  weight: 1.5
                }}
              />
              <Marker position={[sp.lat, sp.lng]} icon={createHubIcon(sp.name, sp.weight)} />
            </React.Fragment>
          ))}

          {/* Mandi Terminal Marker */}
          <Marker position={[mandi.lat, mandi.lng]} icon={createMandiIcon(mandi.name)} />
        </MapContainer>
      </div>
    </div>
  );
}

