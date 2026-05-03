import React, { useState, useEffect } from 'react';
import {
  Truck, Sprout, ArrowRight, TrendingDown, TrendingUp, AlertTriangle,
  Route, Users, Zap, IndianRupee, Leaf, MapPin, Package, ChevronRight, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Login from './Login';
import { useApp } from '../context/AppContext';

const CHART_DATA = [
  { name: 'Cost/km', Traditional: 100, GatiSetu: 42 },
  { name: 'Income/mo', Traditional: 15000, GatiSetu: 23800 },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
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
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <h2 className="text-xs font-black text-invention-orange font-[Outfit] tracking-[-0.02em] uppercase flex items-center gap-2">
                <BarChart3 size={14} /> Performance Audit
              </h2>
              <h3 className="text-3xl font-black text-text-primary font-[Outfit] tracking-[-0.02em] uppercase leading-tight">
                Proven Economic Viability
              </h3>
              <p className="text-text-secondary leading-relaxed">
                GatiSetu isn't just an idea. Our predictive models demonstrate massive cost reductions for farmers and significant profit increases for drivers when compared to traditional logistics networks.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {/* Farmer Savings */}
                <div className="border border-border border-t-4 border-t-mint-green p-5 bg-surface space-y-3">
                  <p className="text-4xl font-black text-mint-green" style={{ fontFamily: 'Inter' }}>-58%</p>
                  <div>
                    <p className="text-xs font-black text-text-primary uppercase tracking-wider" style={{ fontFamily: 'Outfit' }}>Transport Cost</p>
                    <p className="text-[10px] text-text-muted mt-1">Pooled loads vs. individual middlemen trucks</p>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-sm overflow-hidden">
                    <div className="h-full bg-mint-green" style={{ width: '42%' }}></div>
                  </div>
                  <p className="text-[10px] text-mint-green font-bold uppercase tracking-wider">₹42/km vs ₹100/km</p>
                </div>

                {/* Driver Income */}
                <div className="border border-border border-t-4 border-t-invention-orange p-5 bg-surface space-y-3">
                  <p className="text-4xl font-black text-invention-orange" style={{ fontFamily: 'Inter' }}>+59%</p>
                  <div>
                    <p className="text-xs font-black text-text-primary uppercase tracking-wider" style={{ fontFamily: 'Outfit' }}>Driver Income</p>
                    <p className="text-[10px] text-text-muted mt-1">Backhaul loads eliminate empty return trips</p>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-sm overflow-hidden">
                    <div className="h-full bg-invention-orange" style={{ width: '59%' }}></div>
                  </div>
                  <p className="text-[10px] text-invention-orange font-bold uppercase tracking-wider">₹23.8K vs ₹15K / month</p>
                </div>

                {/* Dead Miles */}
                <div className="border border-border border-t-4 border-t-danger p-5 bg-surface space-y-3">
                  <p className="text-4xl font-black text-danger" style={{ fontFamily: 'Inter' }}>-60%</p>
                  <div>
                    <p className="text-xs font-black text-text-primary uppercase tracking-wider" style={{ fontFamily: 'Outfit' }}>Dead Miles</p>
                    <p className="text-[10px] text-text-muted mt-1">Return trucks carry subsidized farming inputs</p>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-sm overflow-hidden">
                    <div className="h-full bg-danger" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-[10px] text-danger font-bold uppercase tracking-wider">Eliminated via Backhaul</p>
                </div>

                {/* Return Goods Discount */}
                <div className="border border-border border-t-4 border-t-mint-green p-5 bg-surface space-y-3">
                  <p className="text-4xl font-black text-mint-green" style={{ fontFamily: 'Inter' }}>-60%</p>
                  <div>
                    <p className="text-xs font-black text-text-primary uppercase tracking-wider" style={{ fontFamily: 'Outfit' }}>Input Costs</p>
                    <p className="text-[10px] text-text-muted mt-1">Seeds & fertilizer via return truck subsidy</p>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-sm overflow-hidden">
                    <div className="h-full bg-mint-green" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-[10px] text-mint-green font-bold uppercase tracking-wider">₹400 vs ₹1000 / bag</p>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8 card-industrial p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} barGap={8} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Inter' }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Inter' }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ background: '#131B2E', border: '1px solid #334155', borderRadius: '2px', color: '#F1F5F9', fontFamily: 'Inter' }}
                  />
                  <Bar dataKey="Traditional" fill="#EF4444" radius={0} maxBarSize={60} />
                  <Bar dataKey="GatiSetu" fill="#16A34A" radius={0} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4 text-[10px] text-text-muted uppercase tracking-wider font-bold">
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-danger" style={{ borderRadius: '2px' }} /> Traditional</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-mint-green" style={{ borderRadius: '2px' }} /> GatiSetu</span>
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
  const W = 800, H = 400;
  const farmers = [
    { x: 80, y: 80, name: 'Rampur' }, { x: 60, y: 160, name: 'Bhojpur' }, { x: 100, y: 240, name: 'Khanpur' }, { x: 50, y: 320, name: 'Sherpur' },
    { x: 260, y: 70, name: 'Noorpur' }, { x: 240, y: 150, name: 'Badlapur' }, { x: 280, y: 260, name: 'Sonarpur' }, { x: 250, y: 340, name: 'Fatehpur' }
  ];
  const setuPoints = [{ x: 400, y: 120, name: 'Setu Hub A' }, { x: 400, y: 280, name: 'Setu Hub B' }];
  const mandi = { x: 720, y: 200, name: 'Azadpur Mandi' };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full bg-surface">
      {/* Grid */}
      {Array.from({ length: 10 }).map((_, i) => (
        <React.Fragment key={`g-${i}`}>
          <line x1={i * 80} y1={0} x2={i * 80} y2={H} stroke="#3F4143" strokeWidth="1" />
          <line x1={0} y1={i * 40} x2={W} y2={i * 40} stroke="#3F4143" strokeWidth="1" />
        </React.Fragment>
      ))}

      {/* Connections */}
      {farmers.slice(0, 4).map((f, i) => <line key={`fa-${i}`} x1={f.x} y1={f.y} x2={setuPoints[0].x} y2={setuPoints[0].y} stroke="rgba(21,128,61,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />)}
      {farmers.slice(4).map((f, i) => <line key={`fb-${i}`} x1={f.x} y1={f.y} x2={setuPoints[1].x} y2={setuPoints[1].y} stroke="rgba(21,128,61,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />)}
      <line x1={setuPoints[0].x} y1={setuPoints[0].y} x2={mandi.x} y2={mandi.y} stroke="#EAB308" strokeWidth="3" />
      <line x1={setuPoints[1].x} y1={setuPoints[1].y} x2={mandi.x} y2={mandi.y} stroke="#EAB308" strokeWidth="3" />

      {/* Nodes */}
      {farmers.map((f, i) => (
        <g key={`fn-${i}`}>
          <rect x={f.x - 6} y={f.y - 6} width="12" height="12" fill="#15803D" opacity="0.9" />
          <text x={f.x} y={f.y + 20} fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="Inter">{f.name}</text>
        </g>
      ))}
      {setuPoints.map((sp, i) => (
        <g key={`sp-${i}`}>
          <rect x={sp.x - 20} y={sp.y - 20} width="40" height="40" fill="rgba(234,179,8,0.1)" stroke="#EAB308" strokeWidth="1" />
          <rect x={sp.x - 10} y={sp.y - 10} width="20" height="20" fill="#EAB308" />
          <text x={sp.x} y={sp.y + 36} fill="#F1F5F9" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="Outfit">{sp.name}</text>
        </g>
      ))}
      <g>
        <rect x={mandi.x - 24} y={mandi.y - 24} width="48" height="48" fill="rgba(148,163,184,0.1)" stroke="#94A3B8" strokeWidth="1" />
        <rect x={mandi.x - 12} y={mandi.y - 12} width="24" height="24" fill="#94A3B8" />
        <text x={mandi.x} y={mandi.y + 40} fill="#F1F5F9" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="Outfit">{mandi.name}</text>
      </g>
      <text x={80} y={H - 16} fill="#15803D" fontSize="12" fontWeight="bold" fontFamily="Outfit" textAnchor="middle">FARMERS</text>
      <text x={400} y={H - 16} fill="#EAB308" fontSize="12" fontWeight="bold" fontFamily="Outfit" textAnchor="middle">SETU POINTS</text>
      <text x={720} y={H - 16} fill="#94A3B8" fontSize="12" fontWeight="bold" fontFamily="Outfit" textAnchor="middle">MANDI</text>
    </svg>
  );
}
