/**
 * GatiSetu — TTS Engine
 * AarogyaVani-style Text-to-Speech using window.speechSynthesis.
 * Supports Hindi (hi-IN) and English (en-IN) with smart voice fallback.
 */

const LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
};

function resolveLangTag(lang) {
  return LANG_MAP[lang] || LANG_MAP[lang?.toLowerCase()] || 'en-IN';
}

/**
 * Speak text aloud in the specified language.
 * @param {string} text - Text to speak
 * @param {string} language - 'en' or 'hi'
 */
export function speakText(text, language = 'en') {
  if (!window.speechSynthesis || !text) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const langTag = resolveLangTag(language);
  const allVoices = window.speechSynthesis.getVoices();

  // Smart voice selection with fallback chain (AarogyaVani pattern)
  let selectedVoice =
    allVoices.find(v => v.lang === langTag && v.localService && !v.name.includes('Online')) ||
    allVoices.find(v => v.lang === langTag && v.localService) ||
    allVoices.find(v => v.lang.startsWith(langTag.split('-')[0]) && v.localService) ||
    allVoices.find(v => v.lang === langTag) ||
    allVoices.find(v => v.lang.startsWith(langTag.split('-')[0]));

  // If no voice found for requested language, try the other language
  if (!selectedVoice) {
    const fallbackTag = language === 'hi' ? 'en-IN' : 'hi-IN';
    selectedVoice =
      allVoices.find(v => v.lang === fallbackTag) ||
      allVoices.find(v => v.lang.startsWith(fallbackTag.split('-')[0]));
    console.warn(`[GatiSetu TTS] No voice for ${langTag}, falling back to ${fallbackTag}`);
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langTag;
  utterance.rate = 0.85;
  utterance.pitch = 1.0;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    console.log(`[GatiSetu TTS] Speaking in ${selectedVoice.lang} (${selectedVoice.name})`);
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any active speech.
 */
export function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Check if voices are loaded (they load async in some browsers).
 * Call this on app mount.
 */
export function preloadVoices() {
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}
