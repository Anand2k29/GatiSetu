import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import KisanDashboard from './components/KisanDashboard';
import SarathiDashboard from './components/SarathiDashboard';
import BenchmarkPage from './components/BenchmarkPage';
import { preloadVoices } from './services/ttsEngine';
import { Sprout, Truck, LogOut, Globe, BarChart3, Menu, X } from 'lucide-react';
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
    { id: 'benchmark', label: t('benchmark'), icon: BarChart3 },
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

            <div className="hidden md:flex items-center gap-0">
              {navItems.map(item => (
                <button key={item.id} onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-xs font-bold tracking-wider uppercase transition-all border-b-2 ${
                    currentView === item.id ? `text-${accentColor} border-b-${accentColor}` : 'text-text-muted border-b-transparent hover:text-text-secondary'
                  }`} style={{ fontFamily: 'Outfit' }}>
                  <item.icon size={14} />{item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-text-muted tracking-wide">
                {t('welcome')}, <span className={`text-${accentColor} font-bold`}>{userName}</span>
              </span>
              <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="btn-outline py-1.5 px-3 text-[10px] flex items-center gap-1.5">
                <Globe size={11} />{language === 'en' ? 'हिन्दी' : 'EN'}
              </button>
              <button onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-danger/70 hover:text-danger border border-danger/20 hover:border-danger/40 transition-all"
                style={{ borderRadius: '2px', fontFamily: 'Outfit' }}>
                <LogOut size={11} />{t('logout')}
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
        {currentView === 'benchmark' && <BenchmarkPage />}
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
