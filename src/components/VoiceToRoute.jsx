import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { voiceToRoute } from '../services/api';
import { speakText, stopSpeaking } from '../services/ttsEngine';
import { Mic, MicOff, X, Volume2, VolumeX, Check, Edit3, Loader2 } from 'lucide-react';

export default function VoiceToRoute({ onClose }) {
  const { language, t } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedOrder, setParsedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError(language === 'en' ? 'Speech recognition not supported in this browser' : 'इस ब्राउज़र में स्पीच पहचान उपलब्ध नहीं है');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const result = Array.from(event.results).map(r => r[0].transcript).join('');
      setTranscript(result);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e) => {
      setIsListening(false);
      setError(`Speech error: ${e.error}`);
    };

    recognition.start();
  }, [language]);

  const handleParse = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError('');

    try {
      const result = await voiceToRoute(transcript, language);
      if (result) {
        setParsedOrder(result);
        // Auto-readback via TTS
        const confirmText = language === 'hi' ? result.confirmation_text_hi : result.confirmation_text_en;
        if (confirmText) {
          setIsSpeaking(true);
          speakText(confirmText, language);
          setTimeout(() => setIsSpeaking(false), 5000);
        }
      } else {
        setError(language === 'en' ? 'Could not parse order. Try again.' : 'ऑर्डर पार्स नहीं हो सका।');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (parsedOrder) {
      const text = language === 'hi' ? parsedOrder.confirmation_text_hi : parsedOrder.confirmation_text_en;
      speakText(text, language);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 5000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
          className="relative z-10 glass-card w-full max-w-lg p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Mic size={20} className="text-invention-orange" />
              {t('voiceOrder')}
            </h2>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
              <X size={18} />
            </button>
          </div>

          <p className="text-xs text-text-secondary border-l-2 border-invention-orange pl-3">
            {language === 'en'
              ? 'Example: "Send 200 kg wheat from Rampur to Azadpur Mandi"'
              : 'उदाहरण: "200 किलो गेहूं रामपुर से आज़ादपुर मंडी भेजना है"'}
          </p>

          {/* Mic Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={isListening ? undefined : startListening}
              className={`w-20 h-20 flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-danger/20 border-2 border-danger text-danger mic-active'
                  : 'bg-invention-orange/15 border-2 border-invention-orange text-invention-orange hover:bg-invention-orange/25'
              }`}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
            <p className="text-xs text-text-muted">
              {isListening
                ? (language === 'en' ? '🔴 Listening...' : '🔴 सुन रहे हैं...')
                : (language === 'en' ? 'Tap to speak' : 'बोलने के लिए टैप करें')}
            </p>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="space-y-3">
              <div className="bg-white/3 border border-border p-3">
                <p className="text-xs text-text-muted mb-1 font-semibold uppercase tracking-wider">
                  {language === 'en' ? 'You said:' : 'आपने कहा:'}
                </p>
                <p className="text-sm text-text-primary font-medium">{transcript}</p>
              </div>

              {!parsedOrder && (
                <button
                  onClick={handleParse}
                  disabled={loading}
                  className="btn-cta w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading
                    ? (language === 'en' ? 'Parsing...' : 'पार्स हो रहा है...')
                    : (language === 'en' ? 'Parse Order with AI' : 'AI से ऑर्डर पार्स करें')}
                </button>
              )}
            </div>
          )}

          {/* Parsed Order */}
          {parsedOrder && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-3">
              <div className="bg-mint-green/5 border border-mint-green/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-mint-green uppercase tracking-wider">
                    {language === 'en' ? 'Parsed Order' : 'पार्स किया गया ऑर्डर'}
                  </p>
                  <span className="text-[10px] text-text-muted bg-white/5 px-2 py-0.5">
                    via {parsedOrder.provider}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {parsedOrder.order.crop_type && (
                    <OrderField label={language === 'en' ? 'Crop' : 'फसल'} value={parsedOrder.order.crop_type} />
                  )}
                  {parsedOrder.order.weight_kg && (
                    <OrderField label={language === 'en' ? 'Weight' : 'वज़न'} value={`${parsedOrder.order.weight_kg} kg`} />
                  )}
                  {parsedOrder.order.source_village && (
                    <OrderField label={language === 'en' ? 'From' : 'स्रोत'} value={parsedOrder.order.source_village} />
                  )}
                  {parsedOrder.order.destination_mandi && (
                    <OrderField label={language === 'en' ? 'To' : 'मंडी'} value={parsedOrder.order.destination_mandi} />
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={handleSpeak}
                  className="flex-1 py-2.5 text-sm font-semibold border border-border text-text-secondary hover:text-text-primary hover:bg-white/3 flex items-center justify-center gap-2 transition-all">
                  {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  {isSpeaking ? (language === 'en' ? 'Stop' : 'रोकें') : (language === 'en' ? 'Listen' : 'सुनें')}
                </button>
                <button onClick={onClose}
                  className="flex-1 btn-cta py-2.5 text-sm flex items-center justify-center gap-2">
                  <Check size={14} /> {t('confirm')}
                </button>
              </div>
            </motion.div>
          )}

          {error && (
            <p className="text-xs text-danger bg-danger/10 border border-danger/20 p-2 text-center">{error}</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function OrderField({ label, value }) {
  return (
    <div className="bg-white/3 p-2 border border-border">
      <p className="text-[10px] text-text-muted uppercase">{label}</p>
      <p className="text-sm font-bold text-text-primary">{value}</p>
    </div>
  );
}
