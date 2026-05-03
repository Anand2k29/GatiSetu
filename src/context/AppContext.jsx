import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const TRANSLATIONS = {
  en: {
    welcome: 'Welcome', logout: 'Logout', kisan: 'Kisan', sarathi: 'Sarathi',
    earnings: 'Earnings', poolingStatus: 'Pooling Status', fuelSavings: 'Fuel Savings',
    routeEfficiency: 'Route Efficiency', bookNow: 'Book Now', confirm: 'Confirm',
    benchmark: 'Benchmark', voiceOrder: 'Voice Order', backhaul: 'Backhaul Offers',
    language: 'Language', hindi: 'हिन्दी', english: 'English',
    setuPoint: 'Setu Point', pooled: 'Pooled', savings: 'Savings',
    carbonSaved: 'CO₂ Saved', distanceSaved: 'Distance Saved',
    profitIncrease: 'Profit Increase', totalWeight: 'Total Weight',
    discount: 'Discount', deadMiles: 'Dead Miles Reduced',
  },
  hi: {
    welcome: 'स्वागत है', logout: 'लॉगआउट', kisan: 'किसान', sarathi: 'सारथी',
    earnings: 'कमाई', poolingStatus: 'पूलिंग स्थिति', fuelSavings: 'ईंधन बचत',
    routeEfficiency: 'मार्ग दक्षता', bookNow: 'अभी बुक करें', confirm: 'पुष्टि करें',
    benchmark: 'तुलना', voiceOrder: 'आवाज़ ऑर्डर', backhaul: 'वापसी भार',
    language: 'भाषा', hindi: 'हिन्दी', english: 'English',
    setuPoint: 'सेतु पॉइंट', pooled: 'पूल किया गया', savings: 'बचत',
    carbonSaved: 'CO₂ बचाया', distanceSaved: 'दूरी बचाई',
    profitIncrease: 'लाभ वृद्धि', totalWeight: 'कुल वज़न',
    discount: 'छूट', deadMiles: 'डेड माइल्स कम',
  },
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('gatisetu_lang') || 'en');
  const [userRole, setUserRole] = useState(null); // 'kisan' or 'sarathi'
  const [userName, setUserName] = useState('');
  const [poolingData, setPoolingData] = useState(null);
  const [backhaulData, setBackhaulData] = useState(null);
  const [liveRequests, setLiveRequests] = useState([]);
  const [totalStats, setTotalStats] = useState({ farmers: 0, savings: 0, co2: 0 });

  const t = (key) => TRANSLATIONS[language]?.[key] || key;

  useEffect(() => { localStorage.setItem('gatisetu_lang', language); }, [language]);

  const login = (role, name = '') => {
    setUserRole(role);
    setUserName(name);
  };

  const logout = () => {
    setUserRole(null);
    setUserName('');
    setPoolingData(null);
    setBackhaulData(null);
  };

  const addRequest = (requestData) => {
    setLiveRequests(prev => [requestData, ...prev]);
    setTotalStats(prev => ({
      farmers: prev.farmers + 1,
      savings: prev.savings + (requestData.savings || 0),
      co2: prev.co2 + (requestData.co2 || 0),
    }));
  };

  const acceptRequest = (id, driverName) => {
    setLiveRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'Accepted', driverName, acceptedAt: new Date().toISOString() } : req
    ));
  };

  const completeRequest = (id) => {
    setLiveRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'Completed', completedAt: new Date().toISOString() } : req
    ));
  };

  const value = {
    language, setLanguage, t,
    userRole, userName, login, logout,
    poolingData, setPoolingData,
    backhaulData, setBackhaulData,
    liveRequests, addRequest, acceptRequest, completeRequest,
    totalStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
