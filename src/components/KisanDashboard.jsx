import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDemoPooling, getDemoBackhaul, getExplanation } from '../services/api';
import { speakText, stopSpeaking } from '../services/ttsEngine';
import VoiceToRoute from './VoiceToRoute';
import AIExplainer from './AIExplainer';
import SetuPointMap from './SetuPointMap';
import QRCode from 'react-qr-code';
import {
  IndianRupee, Leaf, TrendingUp, Package, MapPin, Mic,
  ArrowRight, ShoppingBag, Truck, Users, Zap, Rocket,
  X, Camera, Check, ChevronRight
} from 'lucide-react';

export default function KisanDashboard() {
  const { t, language, poolingData, setPoolingData, backhaulData, setBackhaulData, userName, shipments, addShipment } = useApp();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showVoice, setShowVoice] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

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
        <div className="w-10 h-10 border-2 border-mint-green/30 border-t-mint-green animate-spin" style={{ borderRadius: '2px' }} />
        <p className="text-text-muted text-xs font-bold tracking-wider uppercase" style={{ fontFamily: 'Outfit' }}>
          {language === 'en' ? 'Loading dashboard...' : 'डैशबोर्ड लोड हो रहा है...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ─── KPI Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard icon={<IndianRupee size={18} />} label={t('earnings')} value={`₹${totalEarnings.toLocaleString()}`} sub={language === 'en' ? 'This session' : 'इस सत्र'} accent="mint" />
        <KPICard icon={<Users size={18} />} label={t('pooled')} value={poolingData?.total_farmers_pooled || 0} sub={language === 'en' ? 'Farmers pooled' : 'किसान जुड़े'} accent="orange" />
        <KPICard icon={<Leaf size={18} />} label={t('carbonSaved')} value={`${poolingData?.total_carbon_saved_kg?.toFixed(1) || 0} kg`} sub="CO₂" accent="mint" />
        <KPICard icon={<Zap size={18} />} label={language === 'en' ? 'Efficiency' : 'दक्षता'} value={`${poolingData?.efficiency_pct || 0}%`} sub={language === 'en' ? 'Route optimized' : 'मार्ग अनुकूलित'} accent="orange" />
      </div>

      {/* ─── Tab Bar ─── */}
      <div className="tab-bar">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-item ${activeTab === tab.id ? 'active-mint' : ''}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Active Shipments / Pooling */}
          <div className="space-y-5">
            {/* Active Shipments */}
            {shipments.length > 0 && (
              <div className="card-industrial card-industrial-mint p-5 space-y-4">
                <h3 className="header-label text-mint-green">{t('activeShipments')}</h3>
                {shipments.slice(0, 3).map(s => (
                  <div key={s.id} className="border border-border p-4 space-y-3" style={{ borderRadius: '2px' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary font-mono">{s.id}</span>
                      <span className={s.status === 'verified' ? 'tag-verified' : 'tag-discount'}>{s.status === 'verified' ? '✓ VERIFIED' : 'PENDING'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-text-muted block">Crop</span><span className="text-text-primary font-bold">{s.crop}</span></div>
                      <div><span className="text-text-muted block">Weight</span><span className="text-text-primary font-bold">{s.weight} kg</span></div>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-white" style={{ borderRadius: '2px' }}>
                      <QRCode value={JSON.stringify({ shipmentId: s.id, setuPoint: s.setuPoint, crop: s.crop, weight: s.weight, ts: s.createdAt })} size={80} />
                    </div>
                    <p className="text-center text-[10px] text-text-muted tracking-wider uppercase">{language === 'en' ? 'Show QR to Sarathi for verification' : 'सत्यापन के लिए सारथी को QR दिखाएं'}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Pooling Status */}
            {myGroup && (
              <div className="card-industrial card-industrial-mint p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="header-label text-mint-green flex items-center gap-2"><MapPin size={14} /> {t('poolingStatus')}</h3>
                  <div className="flex items-center gap-2"><div className="status-dot" /><span className="text-[10px] font-bold text-mint-green uppercase tracking-wider">{language === 'en' ? 'Active' : 'सक्रिय'}</span></div>
                </div>
                <div className="border border-border p-3" style={{ borderRadius: '2px' }}>
                  <p className="text-xs text-text-muted mb-1">{language === 'en' ? `Pooled with ${myGroup.farmer_count - 1} other Kisans at:` : `${myGroup.farmer_count - 1} अन्य किसानों के साथ:`}</p>
                  <p className="text-sm font-bold text-mint-green">{myGroup.setu_point.name}</p>
                  <p className="text-[10px] text-text-muted mt-1">{myGroup.setu_point.landmark_type} · {myGroup.setu_point.village_cluster.join(', ')}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <MiniMetric label={t('totalWeight')} value={`${myGroup.total_weight_kg} kg`} />
                  <MiniMetric label={t('carbonSaved')} value={`${myGroup.carbon_saved_kg} kg`} />
                  <MiniMetric label={t('profitIncrease')} value={`₹${myGroup.profit_increase_inr}`} />
                </div>
              </div>
            )}
          </div>

          {/* Voice + AI */}
          <div className="space-y-5">
            <div className="card-industrial card-industrial-orange p-5 space-y-3">
              <h3 className="header-label text-invention-orange flex items-center gap-2"><Mic size={14} /> {t('voiceOrder')}</h3>
              <p className="text-xs text-text-secondary">{language === 'en' ? 'Speak in Hindi or English to create a shipping order instantly.' : 'हिंदी या अंग्रेज़ी में बोलकर तुरंत शिपिंग ऑर्डर बनाएं।'}</p>
              <button onClick={() => setShowVoice(true)} className="btn-cta w-full flex items-center justify-center gap-2">
                <Mic size={16} /> {language === 'en' ? 'Start Voice Order' : 'आवाज़ ऑर्डर शुरू करें'}
              </button>
            </div>
            {poolingData && <AIExplainer poolingData={poolingData} />}
          </div>
        </div>
      )}

      {activeTab === 'pooling' && poolingData && (
        <div className="space-y-5">
          <SetuPointMap groups={poolingData.groups} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {poolingData.groups.map((group, i) => (
              <div key={i} className="card-industrial p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-text-primary">{group.setu_point.name}</h4>
                  <span className="text-[10px] font-bold text-mint-green bg-mint-green/10 px-2 py-1 border border-mint-green/20" style={{ borderRadius: '2px' }}>{group.farmer_count} {language === 'en' ? 'farmers' : 'किसान'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="border border-border p-2" style={{ borderRadius: '2px' }}><span className="text-text-muted block">{t('totalWeight')}</span><span className="text-text-primary font-bold">{group.total_weight_kg} kg</span></div>
                  <div className="border border-border p-2" style={{ borderRadius: '2px' }}><span className="text-text-muted block">{t('carbonSaved')}</span><span className="text-mint-green font-bold">{group.carbon_saved_kg} kg</span></div>
                  <div className="border border-border p-2" style={{ borderRadius: '2px' }}><span className="text-text-muted block">{t('distanceSaved')}</span><span className="text-text-primary font-bold">{(group.total_distance_km - group.optimized_distance_km).toFixed(0)} km</span></div>
                  <div className="border border-border p-2" style={{ borderRadius: '2px' }}><span className="text-text-muted block">{t('profitIncrease')}</span><span className="text-invention-orange font-bold">₹{group.profit_increase_inr}</span></div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.farmers.map((f, j) => (
                    <span key={j} className="text-[10px] text-text-muted px-2 py-0.5 border border-border" style={{ borderRadius: '2px' }}>{f.name} · {f.weight_kg}kg {f.crop}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'backhaul' && (
        <div className="space-y-4">
          <div className="card-industrial p-5">
            <h3 className="header-label text-invention-orange flex items-center gap-2 mb-2"><ShoppingBag size={14} /> {t('backhaul')}</h3>
            <p className="text-xs text-text-secondary">{language === 'en' ? 'Get seeds, fertilizers, and equipment delivered at 60% discount via returning trucks!' : 'खाली लौट रहे ट्रकों से 60% छूट पर बीज, खाद और उपकरण मंगवाएं!'}</p>
          </div>
          {backhaulData?.offers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {backhaulData.offers.map((offer, i) => (
                <div key={i} className="card-industrial card-industrial-orange p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Truck size={14} className="text-invention-orange" /><span className="font-bold text-text-primary text-sm">{offer.truck.driver_name}</span></div>
                    <span className="text-[10px] text-text-muted">{offer.truck.vehicle_number}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{offer.truck.return_route_from} → {offer.truck.return_route_to} · ETA {offer.truck.eta_hours}h</p>
                  <div className="flex items-center justify-between border border-border p-3" style={{ borderRadius: '2px' }}>
                    <div>
                      <p className="text-[10px] text-text-muted line-through">₹{offer.standard_price_inr}</p>
                      <p className="text-xl font-black text-mint-green">₹{offer.discounted_price_inr}</p>
                    </div>
                    <div className="text-right">
                      <span className="tag-discount">🔥 {t('specialOffer')} — {offer.discount_pct}% OFF</span>
                      <p className="text-xs text-mint-green mt-1">{t('savings')}: ₹{offer.savings_inr}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="border border-border px-2 py-1 text-text-muted" style={{ borderRadius: '2px' }}>⛽ {offer.fuel_saved_liters}L saved</span>
                    <span className="border border-border px-2 py-1 text-text-muted" style={{ borderRadius: '2px' }}>🛤️ {offer.dead_miles_reduced_km}km reduced</span>
                  </div>
                  <button className="btn-cta w-full py-2.5 text-sm">{language === 'en' ? 'Book Return Load' : 'वापसी भार बुक करें'}</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-industrial p-12 text-center">
              <Package size={40} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-secondary text-sm">{language === 'en' ? 'No backhaul offers available right now' : 'अभी कोई वापसी भार उपलब्ध नहीं'}</p>
            </div>
          )}
        </div>
      )}

      {/* ─── FAB: Book New Load ─── */}
      <button onClick={() => setShowBooking(true)} className="fab">
        <Rocket size={18} /> {t('bookNewLoad')}
      </button>

      {/* ─── Booking Modal ─── */}
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} poolingData={poolingData} />}

      {/* ─── Voice Modal ─── */}
      {showVoice && <VoiceToRoute onClose={() => setShowVoice(false)} />}
    </div>
  );
}

/* ─── Booking Modal: 3-Step Flow ─── */
function BookingModal({ onClose, poolingData }) {
  const { language, addShipment } = useApp();
  const [step, setStep] = useState(1);
  const [crop, setCrop] = useState('');
  const [weight, setWeight] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedSetu, setSelectedSetu] = useState(null);
  const [newShipment, setNewShipment] = useState(null);
  const [scanning, setScanning] = useState(false);

  const setuPoints = poolingData?.groups?.map(g => g.setu_point) || [];
  const canProceedStep1 = crop.trim() && weight && destination.trim();

  const handleConfirm = () => {
    const shipment = addShipment({
      crop: crop.trim(),
      weight: Number(weight),
      destination: destination.trim(),
      setuPoint: selectedSetu?.name || setuPoints[0]?.name || 'Nearest Hub',
    });
    setNewShipment(shipment);
    setStep(3);

    // TTS readback after booking
    const confirmMsg = language === 'hi'
      ? `आपका ऑर्डर बुक हो गया। ${weight} किलो ${crop}, ${destination} के लिए। गति-पास तैयार है।`
      : `Your order is booked. ${weight} kg ${crop} to ${destination}. Gati-Pass is ready. A Sarathi will accept your load shortly.`;
    setTimeout(() => speakText(confirmMsg, language), 500);
  };

  const handleVisionScan = () => {
    // Simulated Vision AI scan with animation
    setScanning(true);
    setTimeout(() => {
      setCrop('Onion');
      setWeight('200');
      setDestination('Belgaum Mandi');
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 space-y-5" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-text-primary font-[Outfit] tracking-wider uppercase">{language === 'en' ? 'Book New Load' : 'नया भार बुक करें'}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator justify-center">
          <div className={`step-dot ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}>1</div>
          <div className={`step-line ${step > 1 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>2</div>
          <div className={`step-line ${step > 2 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {/* Step 1: Entry */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="header-label">{language === 'en' ? 'Step 1 — Enter Load Details' : 'चरण 1 — भार विवरण दर्ज करें'}</p>
            <button onClick={handleVisionScan} disabled={scanning} className="btn-outline w-full py-2.5 flex items-center justify-center gap-2 text-xs disabled:opacity-50">
              {scanning ? (
                <><span className="w-3 h-3 border-2 border-mint-green/30 border-t-mint-green animate-spin inline-block" style={{ borderRadius: '1px' }} /> {language === 'en' ? 'Scanning crop bag...' : 'फसल बैग स्कैन हो रहा है...'}</>
              ) : (
                <><Camera size={14} /> {language === 'en' ? '📷 Vision AI Scan' : '📷 विज़न AI स्कैन'}</>
              )}
            </button>
            <div className="space-y-3">
              <div>
                <label className="header-label block mb-1.5">{language === 'en' ? 'Crop Type' : 'फसल प्रकार'}</label>
                <input type="text" value={crop} onChange={e => setCrop(e.target.value)} placeholder={language === 'en' ? 'e.g. Wheat, Onion, Rice' : 'जैसे गेहूं, प्याज, चावल'} className="input-dark input-dark-mint" />
              </div>
              <div>
                <label className="header-label block mb-1.5">{language === 'en' ? 'Weight (kg)' : 'वज़न (kg)'}</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="200" className="input-dark input-dark-mint" />
              </div>
              <div>
                <label className="header-label block mb-1.5">{language === 'en' ? 'Destination Mandi' : 'गंतव्य मंडी'}</label>
                <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder={language === 'en' ? 'e.g. Azadpur Mandi' : 'जैसे आज़ादपुर मंडी'} className="input-dark input-dark-mint" />
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!canProceedStep1} className="btn-kisan w-full py-3 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
              {language === 'en' ? 'Find Setu Points' : 'सेतु पॉइंट खोजें'} <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Match Setu Point */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="header-label">{language === 'en' ? 'Step 2 — Select Setu Point' : 'चरण 2 — सेतु पॉइंट चुनें'}</p>
            <div className="border border-border p-3 text-xs text-text-secondary" style={{ borderRadius: '2px' }}>
              {crop} · {weight}kg → {destination}
            </div>
            <div className="space-y-2">
              {setuPoints.length > 0 ? setuPoints.map((sp, i) => (
                <button key={i} onClick={() => setSelectedSetu(sp)} className={`w-full text-left border p-3 transition-all ${selectedSetu?.id === sp.id ? 'border-mint-green bg-mint-green/5' : 'border-border hover:border-border-hover'}`} style={{ borderRadius: '2px' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-text-primary">{sp.name}</span>
                    <span className="text-[10px] text-text-muted">{sp.landmark_type}</span>
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">{sp.village_cluster?.join(', ')}</p>
                </button>
              )) : (
                <div className="border border-border p-3 text-xs text-text-muted" style={{ borderRadius: '2px' }}>No nearby Setu Points found. Will assign nearest hub.</div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn-outline flex-1 py-2.5">{language === 'en' ? 'Back' : 'पीछे'}</button>
              <button onClick={handleConfirm} className="btn-kisan flex-1 py-2.5 flex items-center justify-center gap-2">
                <Check size={14} /> {language === 'en' ? 'Confirm & Generate Pass' : 'पुष्टि करें'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Gati-Pass QR */}
        {step === 3 && newShipment && (
          <div className="space-y-4 text-center">
            <p className="header-label text-mint-green">{language === 'en' ? '✓ Gati-Pass Generated!' : '✓ गति-पास तैयार!'}</p>
            <p className="text-[12px] font-bold text-invention-orange uppercase tracking-wider">{language === 'en' ? '✓ Driver Assigned' : '✓ ड्राइवर असाइन किया गया'}</p>
            <div className="flex items-center justify-center p-4 bg-white mx-auto" style={{ maxWidth: '180px' }}>
              <QRCode value={JSON.stringify({ shipmentId: newShipment.id, setuPoint: newShipment.setuPoint, crop: newShipment.crop, weight: newShipment.weight, ts: newShipment.createdAt })} size={140} />
            </div>
            <div className="mono-data text-left text-[11px]">
              {`ID: ${newShipment.id}\nCrop: ${newShipment.crop}\nWeight: ${newShipment.weight}kg\nSetu: ${newShipment.setuPoint}\nDest: ${newShipment.destination}`}
            </div>
            <button onClick={onClose} className="btn-kisan w-full py-3">{language === 'en' ? 'Done' : 'हो गया'}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, sub, accent }) {
  return (
    <div className={`kpi-card ${accent === 'mint' ? 'kpi-card-mint' : 'kpi-card-orange'} space-y-2`}>
      <div className={`w-7 h-7 flex items-center justify-center ${accent === 'mint' ? 'text-mint-green' : 'text-invention-orange'}`}>{icon}</div>
      <p className="header-label">{label}</p>
      <p className={`text-xl font-black ${accent === 'mint' ? 'text-mint-green' : 'text-invention-orange'}`}>{value}</p>
      <p className="text-[10px] text-text-muted">{sub}</p>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="text-center border border-border p-2 rounded-none">
      <p className="text-[9px] text-text-muted uppercase tracking-wider font-bold" style={{ fontFamily: 'Outfit' }}>{label}</p>
      <p className="text-sm font-bold text-text-primary">{value}</p>
    </div>
  );
}
