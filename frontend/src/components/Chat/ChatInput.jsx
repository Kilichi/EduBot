import { useState } from 'react';
import { FaPlus, FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, disabled, placeholder }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <div className="chat-input-wrapper">
        <button type="button" className="input-action-button">
          <FaPlus />
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder={placeholder || "Query institutional agreements or ask for summaries..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
        />
        <button type="button" className="input-action-button">
          <FaMicrophone />
        </button>
        <button type="submit" className="send-button" disabled={disabled || !message.trim()}>
          <FaPaperPlane className="send-icon" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
