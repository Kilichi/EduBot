'use client';

import { FaRobot } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';

export type ChatMsg = {
  id: number;
  type: 'user' | 'system';
  content: string;
};

export default function ChatMessage({ message }: { message: ChatMsg }) {
  const isSystem = message.type === 'system';
  const isUser = message.type === 'user';

  return (
    <div className={`chat-message ${isSystem ? 'system' : 'user'}`}>
      <div className="message-header">
        {isSystem && (
          <>
            <span className="message-label">ASISTENTE</span>
            <span className="status-dot" />
          </>
        )}
        {isUser && <span className="message-label">TÚ</span>}
      </div>

      <div className="message-content-wrapper">
        {isSystem && (
          <div className="system-icon">
            <FaRobot className="star-icon" />
          </div>
        )}

        <div className={`message-bubble ${isSystem ? 'system-bubble' : 'user-bubble'}`}>
          <p className="message-text">{message.content}</p>
        </div>

        {isUser && (
          <div className="user-icon">
            <HiUserCircle />
          </div>
        )}
      </div>
    </div>
  );
}
