'use client';

import { FormEvent, useState, useEffect, useRef } from 'react';
import { FaPlus, FaMicrophone, FaPaperPlane, FaStop } from 'react-icons/fa';

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: Array<Array<{ transcript: string; isFinal?: boolean }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface Props {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSendMessage, disabled, placeholder }: Props) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;
    const SpeechRecognition = (win.SpeechRecognition as SpeechRecognitionConstructor | undefined)
      || (win.webkitSpeechRecognition as SpeechRecognitionConstructor | undefined);

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = true;

      const resetSilenceTimer = () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 5000);
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

      recognition.onerror = () => {
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  function toggleListening() {
    if (!recognitionRef.current) return;

    if (isListening) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      silenceTimerRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 2000);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }

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
          className={`input-action-button ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          disabled={disabled || !isSupported}
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
