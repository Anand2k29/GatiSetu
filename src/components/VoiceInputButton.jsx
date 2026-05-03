import React, { useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import useSpeechToText from '../hooks/useSpeechToText';
import { cn } from '../lib/utils';

const VoiceInputButton = ({ onTranscript, className, lang = 'en-IN' }) => {
    const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechToText({ lang });

    useEffect(() => {
        if (transcript) {
            onTranscript(transcript);
        }
    }, [transcript, onTranscript]);

    if (!isSupported) return null;

    return (
        <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={cn(
                "p-2 rounded-lg transition-all flex items-center justify-center",
                isListening
                    ? "bg-rose-100 text-rose-600 animate-pulse ring-2 ring-rose-500"
                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                className
            )}
            title={isListening ? "Stop Listening" : "Start Voice Input"}
        >
            {isListening ? (
                <MicOff size={18} />
            ) : (
                <Mic size={18} />
            )}
        </button>
    );
};

export default VoiceInputButton;
