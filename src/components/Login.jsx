import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Truck, Sprout, ArrowRight, Globe } from 'lucide-react';

export default function Login() {
  const { login, language, setLanguage, t } = useApp();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim() && selectedRole) {
      login(selectedRole, name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      {/* Ambient glow orbs */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-invention-orange/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-mint-green/8 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card w-full max-w-md p-8 space-y-8 relative z-10"
      >
        {/* Language Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-all"
          >
            <Globe size={14} />
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </div>

        {/* Logo */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-invention-orange to-orange-soft flex items-center justify-center shadow-lg glow-orange"
          >
            <span className="text-3xl font-black text-white font-[Outfit]">GS</span>
          </motion.div>
          <h1 className="text-3xl font-black text-text-primary font-[Outfit] tracking-tight">
            Gati<span className="text-gradient-orange">Setu</span>
          </h1>
          <p className="text-text-secondary text-sm">
            {language === 'en' ? 'Agentic Logistics Ecosystem' : 'एजेंटिक लॉजिस्टिक्स इकोसिस्टम'}
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest text-center">
            {language === 'en' ? 'Select your role' : 'अपनी भूमिका चुनें'}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole('kisan')}
              className={`p-4 rounded-xl border transition-all duration-300 group text-center ${
                selectedRole === 'kisan'
                  ? 'border-mint-green/40 bg-mint-green/8 shadow-lg glow-mint'
                  : 'border-border hover:border-mint-green/20 bg-surface-glass hover:bg-mint-green/4'
              }`}
            >
              <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 transition-all ${
                selectedRole === 'kisan' ? 'bg-mint-green/20' : 'bg-white/5 group-hover:bg-mint-green/10'
              }`}>
                <Sprout size={24} className={selectedRole === 'kisan' ? 'text-mint-green' : 'text-text-secondary group-hover:text-mint-green'} />
              </div>
              <h3 className={`font-bold text-sm ${selectedRole === 'kisan' ? 'text-mint-green' : 'text-text-primary'}`}>
                {t('kisan')}
              </h3>
              <p className="text-[10px] text-text-muted mt-1">
                {language === 'en' ? 'Pool loads & earn more' : 'भार जोड़ें और कमाएं'}
              </p>
            </button>

            <button
              onClick={() => setSelectedRole('sarathi')}
              className={`p-4 rounded-xl border transition-all duration-300 group text-center ${
                selectedRole === 'sarathi'
                  ? 'border-invention-orange/40 bg-invention-orange/8 shadow-lg glow-orange'
                  : 'border-border hover:border-invention-orange/20 bg-surface-glass hover:bg-invention-orange/4'
              }`}
            >
              <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 transition-all ${
                selectedRole === 'sarathi' ? 'bg-invention-orange/20' : 'bg-white/5 group-hover:bg-invention-orange/10'
              }`}>
                <Truck size={24} className={selectedRole === 'sarathi' ? 'text-invention-orange' : 'text-text-secondary group-hover:text-invention-orange'} />
              </div>
              <h3 className={`font-bold text-sm ${selectedRole === 'sarathi' ? 'text-invention-orange' : 'text-text-primary'}`}>
                {t('sarathi')}
              </h3>
              <p className="text-[10px] text-text-muted mt-1">
                {language === 'en' ? 'Optimize routes & fuel' : 'मार्ग और ईंधन बचाएं'}
              </p>
            </button>
          </div>
        </div>

        {/* Name Input + Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
              {language === 'en' ? 'Your Name' : 'आपका नाम'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'en' ? 'Enter your name...' : 'अपना नाम दर्ज करें...'}
              className="input-dark w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!selectedRole || !name.trim()}
            className="btn-cta w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
          >
            {language === 'en' ? 'Enter GatiSetu' : 'गतिसेतु में प्रवेश करें'}
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-text-muted text-[11px]">
          © 2026 GatiSetu · Team Zenith
        </p>
      </motion.div>
    </div>
  );
}
