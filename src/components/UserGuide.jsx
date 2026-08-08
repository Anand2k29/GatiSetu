import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Sprout, Truck, ShieldCheck, QrCode, ArrowRight,
  Sparkles, CheckCircle2, AlertCircle, HelpCircle, ChevronDown, ExternalLink,
  BookOpen, Zap, Layers, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function UserGuide({ onClose }) {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState('kisan'); // 'kisan' | 'sarathi' | 'backhaul' | 'faq'
  const [playingAudio, setPlayingAudio] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const playVoiceDemo = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    setPlayingAudio(true);
    const text = language === 'hi'
      ? "रामपुर पंचायत भवन सेतु पॉइंट से आजादपुर मंडी के लिए 350 किलो गेहूं का ऑर्डर बुक हो गया है।"
      : "Order confirmed! 350kg Wheat from Rampur Panchayat Setu Point to Azadpur Mandi.";

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => setPlayingAudio(false);
    utterance.onerror = () => setPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const faqs = [
    {
      q: language === 'hi' ? "क्या मुझे ऐप का उपयोग करने के लिए पढ़ना या लिखना आना चाहिए?" : "Do I need to be able to read or write to use GatiSetu?",
      a: language === 'hi'
        ? "बिल्कुल नहीं! GatiSetu वॉइस-फर्स्ट डिज़ाइन किया गया है। आप बस हरे रंग के माइक बटन को दबाकर हिंदी या अपनी भाषा में बोल सकते हैं।"
        : "No! GatiSetu is voice-first. Simply press the green microphone button and speak in your local language."
    },
    {
      q: language === 'hi' ? "किसान को फसल कहाँ छोड़नी होती है?" : "Where do farmers drop off their produce?",
      a: language === 'hi'
        ? "फसलें आपके गाँव के पास 10 किमी के भीतर बने 'सेतु पॉइंट' (जैसे पंचायत भवन, मंदिर चौक) पर एकत्र होती हैं।"
        : "Produce is aggregated at Virtual Setu Points within a 10km radius (such as the local Panchayat Bhawan or Temple Chowk)."
    },
    {
      q: language === 'hi' ? "सारथी को रिटर्न ट्रिप (वापसी) में क्या फायदा मिलता है?" : "How do drivers earn on return trips?",
      a: language === 'hi'
        ? "मंडी से लौटते समय खाली ट्रक खाद, बीज और कृषि उपकरण गाँव लाते हैं, जिससे ड्राइवर को दोनों तरफ की कमाई होती है।"
        : "Return trucks carry subsidized seeds and fertilizers back to villages, earning extra revenue and eliminating dead-miles."
    },
    {
      q: language === 'hi' ? "ड्राइवर असाइनमेंट कैसे सुरक्षित होता है?" : "How is driver assignment secured?",
      a: language === 'hi'
        ? "हमारा 150,000 डेटासेट मशीन लर्निंग मॉडल केवल Tier-1 सत्यापित ड्राइवरों को ही लोड देता है, जिससे 98% डिलीवरी गारंटी मिलती है।"
        : "Our 150,000 dataset ML model matches high-value produce only to Tier-1 verified drivers with <2% cancellation risk."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white p-4 sm:p-8 font-[Outfit] selection:bg-invention-orange selection:text-surface">
      {/* Header */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mint-green flex items-center justify-center rounded-xs shadow-lg">
              <BookOpen size={20} className="text-surface" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-mint-green uppercase tracking-widest bg-mint-green/10 px-2 py-0.5 border border-mint-green/30 rounded-xs">
                  Voice-First Universal Guide
                </span>

              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                GatiSetu Visual User Guide & Workflow
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://gati-setu.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border text-xs font-bold text-text-primary hover:text-white hover:border-invention-orange rounded-xs transition-all shadow-md"
            >
              Open Deployment <ExternalLink size={13} />
            </a>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-danger/20 text-danger border border-danger/40 text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-danger hover:text-white transition-all"
              >
                Close Guide
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 bg-surface-elevated p-1.5 border border-border rounded-xs">
          <button
            onClick={() => setActiveTab('kisan')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-all ${
              activeTab === 'kisan' ? 'bg-mint-green text-surface shadow-lg' : 'text-text-muted hover:text-white'
            }`}
          >
            <Sprout size={16} /> 1. Kisan Voice Booking
          </button>
          <button
            onClick={() => setActiveTab('sarathi')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-all ${
              activeTab === 'sarathi' ? 'bg-invention-orange text-surface shadow-lg' : 'text-text-muted hover:text-white'
            }`}
          >
            <Truck size={16} /> 2. Driver ML Assignment
          </button>
          <button
            onClick={() => setActiveTab('backhaul')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-all ${
              activeTab === 'backhaul' ? 'bg-blue-600 text-white shadow-lg' : 'text-text-muted hover:text-white'
            }`}
          >
            <RefreshCw size={16} /> 3. Return Backhaul Monetization
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-all ${
              activeTab === 'faq' ? 'bg-purple-600 text-white shadow-lg' : 'text-text-muted hover:text-white'
            }`}
          >
            <HelpCircle size={16} /> FAQ & Accessibility
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'kisan' && (
            <motion.div
              key="kisan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Feature Hero Card */}
              <div className="card-industrial p-6 sm:p-8 bg-gradient-to-r from-mint-green/15 via-surface to-surface border-l-4 border-l-mint-green space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-black uppercase text-mint-green">
                      Voice-First Order Booking (No Literacy Barrier)
                    </h2>
                    <p className="text-xs text-text-muted mt-1">
                      Farmers simply press the green button and speak in Hindi or English. No reading or typing required!
                    </p>
                  </div>

                  <button
                    onClick={playVoiceDemo}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xs font-bold text-xs uppercase tracking-wider transition-all shadow-xl ${
                      playingAudio ? 'bg-mint-green text-surface animate-pulse' : 'bg-mint-green/20 text-mint-green border border-mint-green/40 hover:bg-mint-green hover:text-surface'
                    }`}
                  >
                    <Volume2 size={16} /> {playingAudio ? 'Playing Hindi Audio...' : 'Hear Voice Demo 🔊'}
                  </button>
                </div>

                {/* 3 Step Visual Process */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="p-5 bg-surface border border-border space-y-3 relative overflow-hidden group hover:border-mint-green/60 transition-all">
                    <div className="w-10 h-10 bg-mint-green/20 text-mint-green flex items-center justify-center rounded-xs font-black text-lg">
                      1
                    </div>
                    <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                      <Mic size={16} className="text-mint-green" /> Press & Speak
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-[Plus_Jakarta_Sans]">
                      Press the microphone button and speak your load (e.g. <i>"रामपुर से 350 किलो गेहूं"</i>).
                    </p>
                  </div>

                  <div className="p-5 bg-surface border border-border space-y-3 relative overflow-hidden group hover:border-mint-green/60 transition-all">
                    <div className="w-10 h-10 bg-mint-green/20 text-mint-green flex items-center justify-center rounded-xs font-black text-lg">
                      2
                    </div>
                    <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                      <Volume2 size={16} className="text-mint-green" /> Audio Confirmation
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-[Plus_Jakarta_Sans]">
                      The AI translates speech into structured JSON and reads back the confirmation in Hindi/English out loud.
                    </p>
                  </div>

                  <div className="p-5 bg-surface border border-border space-y-3 relative overflow-hidden group hover:border-mint-green/60 transition-all">
                    <div className="w-10 h-10 bg-mint-green/20 text-mint-green flex items-center justify-center rounded-xs font-black text-lg">
                      3
                    </div>
                    <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                      <QrCode size={16} className="text-mint-green" /> Gati-Pass QR Code
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-[Plus_Jakarta_Sans]">
                      Show your green Gati-Pass QR code to the driver upon arrival. No paper receipts needed!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sarathi' && (
            <motion.div
              key="sarathi"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="card-industrial p-6 sm:p-8 bg-gradient-to-r from-invention-orange/15 via-surface to-surface border-l-4 border-l-invention-orange space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase text-invention-orange">
                    Dataset-Driven Driver Matching & Setu Point Pooling
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    Trained on 150,000 real-world freight records to eliminate cancellations and maximize driver income.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-surface border border-border space-y-3">
                    <div className="flex items-center gap-2 text-invention-orange font-bold text-sm uppercase">
                      <ShieldCheck size={18} /> Tier-1 Reliability Matching
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-[Plus_Jakarta_Sans]">
                      High-value agricultural produce is matched only with drivers maintaining a &lt;4.0% cancellation dropout probability, reducing overall cancellation rate from 18.0% down to 2.0%.
                    </p>
                    <div className="p-3 bg-invention-orange/10 border border-invention-orange/30 rounded-xs text-[11px] font-bold text-invention-orange">
                      ✓ 98.0% Guaranteed Pickup Fulfillment
                    </div>
                  </div>

                  <div className="p-5 bg-surface border border-border space-y-3">
                    <div className="flex items-center gap-2 text-invention-orange font-bold text-sm uppercase">
                      <Truck size={18} /> One-Stop Setu Point Pickup
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-[Plus_Jakarta_Sans]">
                      Instead of wasting fuel driving to 5 scattered farms, drivers pick up a guaranteed 100% full capacity load at a single local Setu Hub (e.g. Panchayat Bhawan).
                    </p>
                    <div className="p-3 bg-mint-green/10 border border-mint-green/30 rounded-xs text-[11px] font-bold text-mint-green">
                      ✓ 100% Guaranteed Full Load Capacity
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'backhaul' && (
            <motion.div
              key="backhaul"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="card-industrial p-6 sm:p-8 bg-gradient-to-r from-blue-600/15 via-surface to-surface border-l-4 border-l-blue-500 space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase text-blue-400">
                    Dead-Mile Reduction & Subsidized Return Freight
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    Over 60% of trucks return empty from urban mandis. GatiSetu turns every return mile into revenue.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-surface border border-border space-y-3">
                    <h3 className="text-sm font-bold uppercase text-white">
                      🚚 For Sarathi Drivers: +59% Income Growth
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-[Plus_Jakarta_Sans]">
                      Return trips carry subsidized seeds, fertilizers, and tools back to villages, raising monthly driver income from ₹15,000 to ₹23,800.
                    </p>
                  </div>

                  <div className="p-5 bg-surface border border-border space-y-3">
                    <h3 className="text-sm font-bold uppercase text-white">
                      🌾 For Kisans: 60% Subsidized Input Rates
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-[Plus_Jakarta_Sans]">
                      Farmers get seeds and fertilizers delivered back to their village at a 60% freight discount because the truck is returning anyway!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="card-industrial bg-surface border border-border overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-white hover:text-invention-orange transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle size={18} className="text-invention-orange shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180 text-invention-orange' : 'text-text-muted'}`} />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-text-secondary leading-relaxed font-[Plus_Jakarta_Sans] border-t border-border/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
