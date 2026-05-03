import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Sprout, ArrowRight, Package, Fuel, Users, TrendingUp, IndianRupee, Leaf, Route } from 'lucide-react';

export default function Login() {
  const { login, language } = useApp();
  const [kisanName, setKisanName] = useState('');
  const [sarathiName, setSarathiName] = useState('');
  const [focusedPanel, setFocusedPanel] = useState(null);

  const handleKisanLogin = (e) => {
    e.preventDefault();
    if (kisanName.trim()) login('kisan', kisanName.trim());
  };

  const handleSarathiLogin = (e) => {
    e.preventDefault();
    if (sarathiName.trim()) login('sarathi', sarathiName.trim());
  };

  const kisanProps = [
    { icon: IndianRupee, text: language === 'en' ? 'Access pooled logistics and save up to 60% on transport.' : 'परिवहन पर 60% तक बचाएं' },
    { icon: Users, text: language === 'en' ? 'Pool loads with nearby farmers at Setu Points.' : 'सेतु पॉइंट पर किसानों के साथ भार जोड़ें' },
    { icon: Package, text: language === 'en' ? 'Get 60% off on return goods (seeds, fertilizer).' : 'वापसी सामान पर 60% छूट पाएं' },
  ];

  const sarathiProps = [
    { icon: Route, text: language === 'en' ? 'Maximize earnings by eliminating empty return miles.' : 'खाली वापसी समाप्त कर कमाई बढ़ाएं' },
    { icon: TrendingUp, text: language === 'en' ? '+59% profit increase per optimized trip.' : 'प्रति यात्रा +59% लाभ वृद्धि' },
    { icon: Users, text: language === 'en' ? 'Pre-pooled loads ready for pickup at Setu Points.' : 'सेतु पॉइंट पर भार तैयार' },
  ];

  return (
    <div id="login-portal" className="w-full flex flex-col md:flex-row border-t border-border mt-16">
      {/* ─── KISAN PANEL ─── */}
      <div
        className={`flex-1 border-b md:border-b-0 md:border-r border-border flex flex-col justify-center px-8 py-16 lg:px-16 transition-colors cursor-pointer ${
          focusedPanel === 'kisan' ? 'bg-[#152e1e]' : 'bg-surface'
        }`}
        onClick={() => setFocusedPanel('kisan')}
      >
        <div className="max-w-md mx-auto w-full space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-mint-green flex items-center justify-center" style={{ borderRadius: '2px' }}>
              <Sprout size={24} className="text-surface" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-mint-green font-[Outfit] tracking-[-0.02em] uppercase m-0">
                {language === 'en' ? 'Kisan' : 'किसान'}
              </h2>
              <p className="text-sm text-text-muted font-medium mt-1">
                {language === 'en' ? 'Pool & Prosper' : 'जोड़ें और कमाएं'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {kisanProps.map((prop, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 mt-0.5 flex shrink-0 items-center justify-center border border-mint-green/30" style={{ borderRadius: '2px' }}>
                  <prop.icon size={13} className="text-mint-green" />
                </div>
                <span className="text-[15px] text-text-secondary leading-snug">{prop.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleKisanLogin} className="space-y-4 pt-4 border-t border-border">
            <input
              type="text"
              value={kisanName}
              onChange={(e) => setKisanName(e.target.value)}
              onFocus={() => setFocusedPanel('kisan')}
              placeholder={language === 'en' ? 'Enter your name to continue...' : 'अपना नाम दर्ज करें...'}
              className="input-dark input-dark-mint w-full text-base py-4"
              required
            />
            <button
              type="submit"
              disabled={!kisanName.trim()}
              className="btn-kisan w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {language === 'en' ? 'Enter Portal as Kisan' : 'किसान के रूप में प्रवेश'}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* ─── SARATHI PANEL ─── */}
      <div
        className={`flex-1 flex flex-col justify-center px-8 py-16 lg:px-16 transition-colors cursor-pointer ${
          focusedPanel === 'sarathi' ? 'bg-[#2a2414]' : 'bg-surface'
        }`}
        onClick={() => setFocusedPanel('sarathi')}
      >
        <div className="max-w-md mx-auto w-full space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-invention-orange flex items-center justify-center" style={{ borderRadius: '2px' }}>
              <Truck size={24} className="text-surface" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-invention-orange font-[Outfit] tracking-[-0.02em] uppercase m-0">
                {language === 'en' ? 'Sarathi' : 'सारथी'}
              </h2>
              <p className="text-sm text-text-muted font-medium mt-1">
                {language === 'en' ? 'Route & Earn' : 'मार्ग बनाएं और कमाएं'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sarathiProps.map((prop, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 mt-0.5 flex shrink-0 items-center justify-center border border-invention-orange/30" style={{ borderRadius: '2px' }}>
                  <prop.icon size={13} className="text-invention-orange" />
                </div>
                <span className="text-[15px] text-text-secondary leading-snug">{prop.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSarathiLogin} className="space-y-4 pt-4 border-t border-border">
            <input
              type="text"
              value={sarathiName}
              onChange={(e) => setSarathiName(e.target.value)}
              onFocus={() => setFocusedPanel('sarathi')}
              placeholder={language === 'en' ? 'Enter your name to continue...' : 'अपना नाम दर्ज करें...'}
              className="input-dark w-full text-base py-4"
              required
            />
            <button
              type="submit"
              disabled={!sarathiName.trim()}
              className="btn-sarathi w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {language === 'en' ? 'Enter Portal as Sarathi' : 'सारथी के रूप में प्रवेश'}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
