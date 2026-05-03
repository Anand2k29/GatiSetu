import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
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

  // Preload TTS voices on mount
  useEffect(() => { preloadVoices(); }, []);

  // Reset view on role change
  useEffect(() => { setCurrentView('dashboard'); }, [userRole]);

  if (!userRole) return <Login />;

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
    <div className="min-h-screen bg-mesh">
      {/* ─── Ambient Background Orbs ─── */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[180px] ${
          userRole === 'kisan' ? 'bg-mint-green/6' : 'bg-invention-orange/6'
        }`} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[150px] bg-purple-500/4" />
      </div>

      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 h-16 z-50 backdrop-blur-xl bg-surface/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${
                userRole === 'kisan' ? 'from-mint-green to-mint-soft' : 'from-invention-orange to-orange-soft'
              } flex items-center justify-center shadow-md`}>
                <span className="text-sm font-black text-surface">GS</span>
              </div>
              <span className="text-lg font-black text-text-primary font-[Outfit] tracking-tight hidden sm:block">
                Gati<span className={`text-${accentColor}`}>Setu</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    currentView === item.id
                      ? `text-${accentColor} bg-white/5`
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/3'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                  {currentView === item.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={`absolute bottom-0 left-2 right-2 h-0.5 bg-${accentColor} rounded-full`}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-text-muted">
                {t('welcome')}, <span className={`text-${accentColor} font-bold`}>{userName}</span>
              </span>
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-all"
              >
                <Globe size={12} />
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-danger/70 hover:text-danger hover:bg-danger/10 transition-all"
              >
                <LogOut size={12} />
                {t('logout')}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden glass-card mx-4 mt-2 p-3 space-y-1 absolute left-0 right-0"
            >
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    currentView === item.id ? `text-${accentColor} bg-white/5` : 'text-text-secondary'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex items-center justify-between px-4">
                <button
                  onClick={() => { setLanguage(language === 'en' ? 'hi' : 'en'); setMobileMenuOpen(false); }}
                  className="text-xs font-semibold text-text-secondary"
                >
                  <Globe size={14} className="inline mr-1" />
                  {language === 'en' ? 'हिन्दी' : 'English'}
                </button>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-xs font-semibold text-danger/70">
                  <LogOut size={14} className="inline mr-1" /> {t('logout')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'dashboard' && (
              userRole === 'kisan' ? <KisanDashboard /> : <SarathiDashboard />
            )}
            {currentView === 'benchmark' && <BenchmarkPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-text-muted text-xs">
        <p>© 2026 GatiSetu · Agentic Logistics Ecosystem</p>
      </footer>
    </div>
  );
}

export default App;
