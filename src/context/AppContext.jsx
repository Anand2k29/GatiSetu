import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
    bookNewLoad: 'Book New Load', activeShipments: 'Active Shipments',
    gatiPass: 'Gati-Pass', verified: 'Verified', pending: 'Pending',
    scanGatiPass: 'Scan Gati-Pass', loadVerified: 'Load Verified',
    specialOffer: 'Special Offer', fuelSavedVsTraditional: 'Fuel Saved vs Traditional',
    deadMilesEliminated: 'Dead-Miles Eliminated',
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
    bookNewLoad: 'नया भार बुक करें', activeShipments: 'सक्रिय शिपमेंट',
    gatiPass: 'गति-पास', verified: 'सत्यापित', pending: 'लंबित',
    scanGatiPass: 'गति-पास स्कैन करें', loadVerified: 'भार सत्यापित',
    specialOffer: 'विशेष प्रस्ताव', fuelSavedVsTraditional: 'पारंपरिक से ईंधन बचत',
    deadMilesEliminated: 'डेड-माइल्स समाप्त',
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
  const [shipments, setShipments] = useState([]);

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
    setShipments([]);
  };

  const generateShipmentId = useCallback(() => {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GS-${ts}-${rand}`;
  }, []);

  // Virtual Sarathi driver names for demo auto-accept
  const VIRTUAL_SARATHIS = ['Rakesh Sarathi', 'Sunil Yadav', 'Mahesh Gupta', 'Pappu Khan', 'Arvind Kumar', 'Baldev Singh'];

  const addShipment = useCallback((shipmentData) => {
    const shipment = {
      id: generateShipmentId(),
      ...shipmentData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      verifiedAt: null,
      verifiedBy: null,
    };
    setShipments(prev => [shipment, ...prev]);

    // Virtual Sarathi: auto-accept after 5 seconds for demo
    setTimeout(() => {
      const driverName = VIRTUAL_SARATHIS[Math.floor(Math.random() * VIRTUAL_SARATHIS.length)];
      setShipments(prev => prev.map(s =>
        s.id === shipment.id && s.status === 'pending'
          ? { ...s, status: 'verified', verifiedAt: new Date().toISOString(), verifiedBy: driverName }
          : s
      ));
    }, 5000);

    return shipment;
  }, [generateShipmentId]);

  const verifyShipment = useCallback((shipmentId, driverName) => {
    setShipments(prev => prev.map(s =>
      s.id === shipmentId
        ? { ...s, status: 'verified', verifiedAt: new Date().toISOString(), verifiedBy: driverName }
        : s
    ));
  }, []);

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
    shipments, addShipment, verifyShipment, generateShipmentId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
