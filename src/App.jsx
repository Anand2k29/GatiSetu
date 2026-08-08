import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import KisanDashboard from './components/KisanDashboard';
import SarathiDashboard from './components/SarathiDashboard';
import BenchmarkPage from './components/BenchmarkPage';
import ReliabilityAnalytics from './components/ReliabilityAnalytics';
import UserGuide from './components/UserGuide';
import { preloadVoices } from './services/ttsEngine';
import { Sprout, Truck, LogOut, Globe, BarChart3, ShieldCheck, BookOpen, Menu, X } from 'lucide-react';
import './App.css';

function App() {
  const { userRole, userName, logout, language, setLanguage, t } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { preloadVoices(); }, []);
  useEffect(() => { setCurrentView('dashboard'); }, [userRole]);

  // Landing page includes the embedded Login portal at the bottom
  if (!userRole) return <LandingPage />;

  const navItems = [
    {
      id: 'dashboard',
      label: userRole === 'kisan' ? t('kisan') : t('sarathi'),
      icon: userRole === 'kisan' ? Sprout : Truck,
    },
    { id: 'reliability', label: language === 'en' ? 'Driver Reliability' : 'ड्राइवर विश्वसनीयता', icon: ShieldCheck },
    { id: 'benchmark', label: t('benchmark'), icon: BarChart3 },
    { id: 'guide', label: language === 'en' ? 'User Guide' : 'उपयोगकर्ता मार्गदर्शिका', icon: BookOpen },
  ];


  const accentColor = userRole === 'kisan' ? 'mint-green' : 'invention-orange';

  return (
    <div className="min-h-screen bg-surface">
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 h-14 z-50 bg-surface-elevated border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              <div className={`w-8 h-8 flex items-center justify-center ${userRole === 'kisan' ? 'bg-mint-green' : 'bg-invention-orange'}`} style={{ borderRadius: '2px' }}>
                <span className="text-xs font-black text-surface font-[Outfit]">GS</span>
              </div>
              <span className="text-sm font-black text-text-primary font-[Outfit] tracking-wider uppercase hidden sm:block">
                Gati<span className={`text-${accentColor}`}>Setu</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 bg-surface/80 p-1 border border-border/80 rounded-xs">
              {navItems.map(item => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-black tracking-wider uppercase transition-all rounded-xs ${
                      isActive
                        ? userRole === 'kisan'
                          ? 'bg-mint-green text-surface shadow-md'
                          : 'bg-invention-orange text-surface shadow-md'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                    }`}
                    style={{ fontFamily: 'Outfit' }}
                  >
                    <item.icon size={14} className={isActive ? 'text-surface' : 'text-text-muted'} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-text-muted tracking-wide font-[Outfit]">
                {t('welcome')}, <span className={`text-${accentColor} font-bold`}>{userName}</span>
              </span>
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider bg-surface hover:bg-surface-elevated border border-border hover:border-invention-orange/50 text-text-primary transition-all rounded-xs flex items-center gap-1.5 font-[Outfit]"
              >
                <Globe size={13} className="text-invention-orange" />
                {language === 'en' ? 'हिन्दी (Hindi)' : 'English (EN)'}
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold tracking-wider uppercase text-danger hover:bg-danger/10 border border-danger/30 hover:border-danger transition-all rounded-xs font-[Outfit]"
              >
                <LogOut size={13} />
                {t('logout')}
              </button>
            </div>

            <button className="md:hidden p-2 text-text-secondary hover:text-text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden card-industrial mx-4 mt-1 p-3 space-y-1 absolute left-0 right-0">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setCurrentView(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold tracking-wider uppercase transition-all ${
                  currentView === item.id ? `text-${accentColor}` : 'text-text-muted'
                }`} style={{ fontFamily: 'Outfit', borderRadius: '2px' }}>
                <item.icon size={16} />{item.label}
              </button>
            ))}
            <div className="border-t border-border pt-2 mt-2 flex items-center justify-between px-4">
              <button onClick={() => { setLanguage(language === 'en' ? 'hi' : 'en'); setMobileMenuOpen(false); }}
                className="text-[10px] font-bold tracking-wider uppercase text-text-muted" style={{ fontFamily: 'Outfit' }}>
                <Globe size={12} className="inline mr-1" />{language === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-[10px] font-bold tracking-wider uppercase text-danger/70" style={{ fontFamily: 'Outfit' }}>
                <LogOut size={12} className="inline mr-1" /> {t('logout')}
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-18 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {currentView === 'dashboard' && (userRole === 'kisan' ? <KisanDashboard /> : <SarathiDashboard />)}
        {currentView === 'reliability' && <ReliabilityAnalytics />}
        {currentView === 'benchmark' && <BenchmarkPage />}
        {currentView === 'guide' && <UserGuide />}
      </main>


      <footer className="py-4 text-center border-t border-border">
        <p className="text-text-muted text-[10px] tracking-wider uppercase font-medium" style={{ fontFamily: 'Outfit' }}>
          © 2026 GatiSetu · Agentic Logistics Ecosystem
        </p>
      </footer>
    </div>
  );
}

export default App;
