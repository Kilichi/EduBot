'use client';

import { FormEvent, useState, useEffect, useRef } from 'react';
import { FaPlus, FaMicrophone, FaPaperPlane, FaStop } from 'react-icons/fa';

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: Array<Array<{ transcript: string; isFinal?: boolean }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface Props {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const SILENCE_TIMEOUT = 5000;
const MAX_RESTARTS = 3;

export default function ChatInput({ onSendMessage, disabled, placeholder }: Props) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldListenRef = useRef(false);
  const restartCountRef = useRef(0);

  const isBrave = () => !!(window as unknown as Record<string, unknown>).brave;

  const handleVoiceError = (error: string) => {
    let errorMessage = 'Tu navegador no soporta reconocimiento de voz.';

    if (isBrave() || error === 'network') {
      errorMessage = 'El reconocimiento de voz no funciona en Brave. Usa Chrome o Safari.';
    } else if (error === 'not-allowed') {
      errorMessage = 'Permiso de micrófono denegado.';
    } else if (error === 'no-speech') {
      return;
    }

    setVoiceError(errorMessage);
  };

  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;
    const SpeechRecognition = (win.SpeechRecognition as SpeechRecognitionConstructor | undefined)
      || (win.webkitSpeechRecognition as SpeechRecognitionConstructor | undefined);

    if (!SpeechRecognition) {
      setVoiceError('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    const resetSilenceTimer = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        shouldListenRef.current = false;
        setIsListening(false);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, SILENCE_TIMEOUT);
    };

    recognition.onstart = () => {
      restartCountRef.current = 0;
    };

    recognition.onresult = (e: { results: Array<Array<{ transcript: string; isFinal?: boolean }>> }) => {
      resetSilenceTimer();
      let finalTranscript = '';
      for (let i = e.results[0].length - 1; i >= 0; i--) {
        const transcript = e.results[0][i].transcript;
        if (e.results[0][i].isFinal) {
          finalTranscript += transcript;
        } else {
          setMessage(transcript);
          return;
        }
      }
      if (finalTranscript) {
        setMessage((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = (e: { error: string }) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;

      shouldListenRef.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      handleVoiceError(e.error);
    };

    recognition.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      if (shouldListenRef.current && restartCountRef.current < MAX_RESTARTS) {
        restartCountRef.current++;
        try {
          recognition.start();
        } catch {
          shouldListenRef.current = false;
          setIsListening(false);
        }
      } else {
        shouldListenRef.current = false;
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      try {
        recognition.abort();
      } catch {
        // Ignore
      }
    };
  }, []);

  function toggleListening() {
    if (!recognitionRef.current || !isSupported) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    if (isListening) {
      shouldListenRef.current = false;
      restartCountRef.current = 0;
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
      setIsListening(false);
    } else {
      setMessage('');
      setVoiceError(null);
      shouldListenRef.current = true;
      restartCountRef.current = 0;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
        handleVoiceError('network');
      }
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current && isListening) {
      shouldListenRef.current = false;
      restartCountRef.current = 0;
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }

  const microphoneDisabled = disabled || !isSupported;

  return (
    <form className="chat-input-container" onSubmit={handleSubmit} suppressHydrationWarning>
      <div className="chat-input-wrapper">
        <button type="button" className="input-action-button">
          <FaPlus />
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder={placeholder || 'Consulta acuerdos institucionales o solicita resúmenes...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          suppressHydrationWarning
        />
        <button
          type="button"
          className={`input-action-button ${isListening ? 'listening' : ''} ${voiceError ? 'voice-error' : ''}`}
          onClick={toggleListening}
          disabled={microphoneDisabled}
          title={voiceError || (isListening ? 'Detener' : 'Grabar voz')}
        >
          {isListening ? <FaStop /> : <FaMicrophone />}
        </button>
        <button type="submit" className="send-button" disabled={disabled || message.trim().length === 0} suppressHydrationWarning>
          <FaPaperPlane className="send-icon" />
        </button>
      </div>
      {voiceError && (
        <div className="voice-error-message">{voiceError}</div>
      )}
    </form>
  );
}
