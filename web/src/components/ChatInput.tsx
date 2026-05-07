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

const SILENCE_TIMEOUT = 3000;

export default function ChatInput({ onSendMessage, disabled, placeholder }: Props) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;
    const SpeechRecognition = (win.SpeechRecognition || win.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e: { results: Array<Array<{ transcript: string; isFinal?: boolean }>> }) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      for (let i = e.results[0].length - 1; i >= 0; i--) {
        const item = e.results[0][i];
        if (!item.isFinal) {
          setMessage(item.transcript);
          silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              try { recognitionRef.current.stop(); } catch { /* ignore */ }
            }
          }, SILENCE_TIMEOUT);
          return;
        }
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setIsProcessing(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsProcessing(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      try { recognition.abort(); } catch { /* ignore */ }
    };
  }, []);

  function toggleListening() {
    if (!recognitionRef.current || !isSupported) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    if (isListening) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      setIsListening(false);
    } else {
      setMessage('');
      setIsProcessing(true);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
        setIsProcessing(false);
      }
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current && isListening) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
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
          className={`input-action-button ${isListening ? 'listening' : ''} ${isProcessing && !isListening ? 'processing' : ''}`}
          onClick={toggleListening}
          disabled={microphoneDisabled}
          title={isListening ? 'Detener' : 'Grabar voz'}
        >
          {isListening ? <FaStop /> : <FaMicrophone />}
        </button>
        <button type="submit" className="send-button" disabled={disabled || message.trim().length === 0} suppressHydrationWarning>
          <FaPaperPlane className="send-icon" />
        </button>
      </div>
    </form>
  );
}
