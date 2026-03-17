'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import ChatMessage, { ChatMsg } from '@/components/ChatMessage';
import AgreementDisplay from '@/components/AgreementDisplay';
import ChatInput from '@/components/ChatInput';
import { api, Agreement } from '@/lib/api-client';

type DashMsg = ChatMsg & { agreements?: Agreement[] };

export default function DashboardPage() {
  const [messages, setMessages] = useState<DashMsg[]>([
    { id: 1, type: 'system', content: 'Bienvenido al chat de acuerdos aqui puedes consultar los acuerdos que quieras.', agreements: [] },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function handleSendMessage(message: string) {
    const userMessage: DashMsg = { id: Date.now(), type: 'user', content: message, agreements: [] };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const response = await api.consultar(message);
      const respuesta = response.respuesta || '';
      const acuerdos = response.acuerdos || [];

      const textoPrincipal = acuerdos.length > 0 && (!respuesta || respuesta.length < 5)
        ? `He encontrado ${acuerdos.length} acuerdo${acuerdos.length > 1 ? 's' : ''}:`
        : respuesta;

      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        type: 'system',
        content: textoPrincipal,
        agreements: acuerdos,
      }]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Lo siento, hubo un error al procesar tu consulta.';
      setMessages((prev) => [...prev, { id: Date.now() + 1, type: 'system', content: msg, agreements: [] }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Consultar Acuerdos</h1>
          </div>
        </div>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessage message={message} />
                {message.agreements && message.agreements.length > 0 && (
                  <div className="agreements-container">
                    {message.agreements.map((agreement, index) => (
                      <AgreementDisplay key={index} agreement={agreement} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="loading-message">
                <div className="loading-dots"><span /><span /><span /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>

        <div className="dashboard-footer">
          <span className="footer-text">Jose Poveda</span>
          <span className="footer-dot">•</span>
          <span className="footer-text">Ies Hermanos Amoros</span>
        </div>
      </div>
    </Layout>
  );
}
