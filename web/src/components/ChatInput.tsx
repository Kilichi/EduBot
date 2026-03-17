'use client';

import { FormEvent, useState } from 'react';
import { FaPlus, FaMicrophone, FaPaperPlane } from 'react-icons/fa';

interface Props {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSendMessage, disabled, placeholder }: Props) {
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
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
        />
        <button type="button" className="input-action-button">
          <FaMicrophone />
        </button>
        <button type="submit" className="send-button" disabled={disabled || message.trim().length === 0} suppressHydrationWarning>
          <FaPaperPlane className="send-icon" />
        </button>
      </div>
    </form>
  );
}
