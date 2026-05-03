import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { voiceToRoute } from '../services/api';
import { speakText, stopSpeaking } from '../services/ttsEngine';
import { Mic, MicOff, X, Volume2, VolumeX, Check, Loader2 } from 'lucide-react';

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
    recognition.onerror = (e) => { setIsListening(false); setError(`Speech error: ${e.error}`); };
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
        const confirmText = language === 'hi' ? result.confirmation_text_hi : result.confirmation_text_en;
        if (confirmText) { setIsSpeaking(true); speakText(confirmText, language); setTimeout(() => setIsSpeaking(false), 5000); }
      } else {
        setError(language === 'en' ? 'Could not parse order. Try again.' : 'ऑर्डर पार्स नहीं हो सका।');
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleSpeak = () => {
    if (isSpeaking) { stopSpeaking(); setIsSpeaking(false); }
    else if (parsedOrder) {
      const text = language === 'hi' ? parsedOrder.confirmation_text_hi : parsedOrder.confirmation_text_en;
      speakText(text, language);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 5000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 space-y-5" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-black text-invention-orange font-[Outfit] tracking-wider uppercase flex items-center gap-2">
              <Mic size={16} /> Kisan Sahayak
            </h2>
            <p className="text-[10px] text-text-muted mt-0.5">{t('voiceOrder')}</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
        </div>

        <p className="text-xs text-text-secondary border-l-2 border-invention-orange pl-3">
          {language === 'en' ? 'Example: "200kg onions for Belgaum"' : 'उदाहरण: "200 किलो प्याज बेलगाम के लिए"'}
        </p>

        {/* Mic Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={isListening ? undefined : startListening}
            className={`w-16 h-16 flex items-center justify-center border-2 transition-all ${
              isListening
                ? 'border-danger bg-danger/10 text-danger mic-active'
                : 'border-invention-orange bg-invention-orange/10 text-invention-orange hover:bg-invention-orange/20'
            }`}
            style={{ borderRadius: '2px' }}
          >
            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
          <p className="text-[10px] text-text-muted tracking-wider uppercase" style={{ fontFamily: 'Outfit' }}>
            {isListening ? (language === 'en' ? '● Listening...' : '● सुन रहे हैं...') : (language === 'en' ? 'Tap to speak' : 'बोलने के लिए टैप करें')}
          </p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="space-y-3">
            <div className="border border-border p-3" style={{ borderRadius: '2px' }}>
              <p className="header-label mb-1">{language === 'en' ? 'You said:' : 'आपने कहा:'}</p>
              <p className="text-sm text-text-primary font-medium">{transcript}</p>
            </div>
            {!parsedOrder && (
              <button onClick={handleParse} disabled={loading} className="btn-cta w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                {loading ? (language === 'en' ? 'Parsing...' : 'पार्स हो रहा है...') : (language === 'en' ? 'Parse Order with AI' : 'AI से ऑर्डर पार्स करें')}
              </button>
            )}
          </div>
        )}

        {/* Parsed Order — Monospace Data */}
        {parsedOrder && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="header-label text-mint-green">{language === 'en' ? 'Parsed Order' : 'पार्स किया गया ऑर्डर'}</p>
              <span className="text-[9px] text-text-muted border border-border px-2 py-0.5" style={{ borderRadius: '2px' }}>via {parsedOrder.provider}</span>
            </div>
            <div className="mono-data text-[11px]">
              {`crop_type: "${parsedOrder.order.crop_type || '—'}"\nweight_kg: ${parsedOrder.order.weight_kg || '—'}\nsource: "${parsedOrder.order.source_village || '—'}"\ndestination: "${parsedOrder.order.destination_mandi || '—'}"`}
            </div>
            <div className="flex gap-2">
              <button onClick={handleSpeak} className="btn-outline flex-1 py-2.5 text-xs flex items-center justify-center gap-2">
                {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                {isSpeaking ? (language === 'en' ? 'Stop' : 'रोकें') : (language === 'en' ? 'Listen' : 'सुनें')}
              </button>
              <button onClick={onClose} className="btn-kisan flex-1 py-2.5 text-xs flex items-center justify-center gap-2">
                <Check size={13} /> {t('confirm')}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-danger bg-danger/5 border border-danger/20 p-2 text-center" style={{ borderRadius: '2px' }}>{error}</p>
        )}
      </div>
    </div>
  );
}
