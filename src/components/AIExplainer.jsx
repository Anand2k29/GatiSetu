import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { getExplanation } from '../services/api';
import { speakText, stopSpeaking } from '../services/ttsEngine';
import { Brain, Volume2, VolumeX, Loader2, Sparkles } from 'lucide-react';

export default function AIExplainer({ poolingData }) {
  const { language, t } = useApp();
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const fetchExplanation = async () => {
    if (!poolingData) return;
    setLoading(true);
    const result = await getExplanation(poolingData);
    if (result) {
      setExplanation(result);
      // Typewriter effect
      const text = language === 'hi' ? result.explanation_hi : result.explanation_en;
      typewriterEffect(text);
    } else {
      // Fallback mock
      const mock = language === 'hi'
        ? `मैंने ${poolingData.total_farmers_pooled} किसानों को ${poolingData.groups.length} मार्गों में जोड़ा, ${poolingData.total_carbon_saved_kg.toFixed(1)} kg CO₂ बचाया और सारथी का लाभ ₹${poolingData.total_profit_increase_inr} बढ़ाया।`
        : `I pooled ${poolingData.total_farmers_pooled} farmers into ${poolingData.groups.length} optimized routes, saving ${poolingData.total_carbon_saved_kg.toFixed(1)} kg CO₂ and increasing driver profit by ₹${poolingData.total_profit_increase_inr}.`;
      setExplanation({ explanation_en: mock, explanation_hi: mock, metrics: {}, provider: 'mock' });
      typewriterEffect(mock);
    }
    setLoading(false);
  };

  const typewriterEffect = (text) => {
    setIsTyping(true);
    setDisplayText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (explanation) {
      const text = language === 'hi' ? explanation.explanation_hi : explanation.explanation_en;
      speakText(text, language);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 8000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5 space-y-4 border-l-2 border-l-invention-orange"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Brain size={16} className="text-invention-orange" />
          {language === 'en' ? 'AI Logic Explainer' : 'AI तर्क व्याख्या'}
        </h3>
        {explanation && (
          <span className="text-[10px] text-text-muted bg-white/5 px-2 py-0.5 border border-border">
            {explanation.provider}
          </span>
        )}
      </div>

      {!explanation && !loading && (
        <button onClick={fetchExplanation}
          className="btn-cta w-full py-2.5 text-sm flex items-center justify-center gap-2">
          <Sparkles size={14} />
          {language === 'en' ? 'Generate Explanation' : 'व्याख्या बनाएं'}
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-6 gap-2 text-text-secondary">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">{language === 'en' ? 'AI is thinking...' : 'AI सोच रहा है...'}</span>
        </div>
      )}

      {explanation && (
        <div className="space-y-3">
          <div className="bg-white/3 border border-border p-4">
            <p className="text-sm text-text-primary leading-relaxed">
              {displayText}
              {isTyping && <span className="typewriter-cursor" />}
            </p>
          </div>

          {/* Metrics highlights */}
          {poolingData && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-mint-green/5 border border-mint-green/15 p-2">
                <p className="text-lg font-black text-mint-green">{poolingData.total_farmers_pooled}</p>
                <p className="text-[9px] text-text-muted uppercase">{language === 'en' ? 'Farmers' : 'किसान'}</p>
              </div>
              <div className="bg-mint-green/5 border border-mint-green/15 p-2">
                <p className="text-lg font-black text-mint-green">{poolingData.total_carbon_saved_kg.toFixed(0)}kg</p>
                <p className="text-[9px] text-text-muted uppercase">CO₂</p>
              </div>
              <div className="bg-invention-orange/5 border border-invention-orange/15 p-2">
                <p className="text-lg font-black text-invention-orange">₹{poolingData.total_profit_increase_inr}</p>
                <p className="text-[9px] text-text-muted uppercase">{language === 'en' ? 'Profit' : 'लाभ'}</p>
              </div>
            </div>
          )}

          <button onClick={handleSpeak}
            className="w-full py-2 text-sm font-semibold border border-border text-text-secondary hover:text-text-primary hover:bg-white/3 flex items-center justify-center gap-2 transition-all">
            {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {isSpeaking
              ? (language === 'en' ? 'Stop Audio' : 'ऑडियो रोकें')
              : (language === 'en' ? 'Listen to Explanation' : 'व्याख्या सुनें')}
          </button>
        </div>
      )}
    </motion.div>
  );
}
